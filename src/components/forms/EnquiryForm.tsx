"use client";

import Link from "next/link";
import { CircleCheck } from "lucide-react";
import {
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/cn";
import type { Choice, ChoiceNote } from "@/lib/enquiries";
import { setQuery, useQuery } from "@/lib/query";
import {
  CheckRow,
  ChoiceGroup,
  ErrorSummary,
  ErrorText,
  Field,
  NotConnectedNote,
  describedBy,
  inputClass,
} from "./fields";

/* One form for the site's enquiries: partnership, pledge or sponsor, and
   contact. Each page describes its fields; this component lays them out,
   checks them and shows the result. Sending is wired in Prompt 16. */

type Base = {
  name: string;
  label: string;
  hint?: string;
  /** Required unless this is true. */
  optional?: boolean;
  /** The error shown when a required field is empty. */
  message?: string;
  /** "half" fields sit two to a row on wider screens. */
  width?: "half" | "full";
};

type Choosing = {
  options: Choice[];
  /** Keep the value in the address under this key, so links can pre-fill it. */
  queryKey?: string;
  /** Notes shown under the field for particular values. */
  notes?: Record<string, ChoiceNote>;
};

export type FieldSpec =
  | (Base & {
      kind: "text" | "email" | "tel";
      autoComplete?: string;
    })
  | (Base & { kind: "textarea"; rows?: number })
  | (Base & { kind: "select" } & Choosing)
  | (Base & { kind: "choice" } & Choosing)
  | (Base & { kind: "checks"; options: Choice[] });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT = 3000;

function fieldId(formId: string, name: string) {
  return `${formId}-${name}`;
}

/** A link that pre-fills one choice in a form and moves to it. Without
    JavaScript it is an ordinary link to the form. */
export function PrefillLink({
  formId,
  field,
  value,
  children,
  className,
}: {
  formId: string;
  /** The field's name, which is also its key in the address. */
  field: string;
  value: string;
  children: ReactNode;
  className?: string;
}) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setQuery(field, value);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document
      .getElementById(formId)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    // A choice group's first radio carries the field id; focus the chosen one.
    const target =
      document.querySelector<HTMLElement>(
        `[name="${field}"][value="${value}"]`,
      ) ?? document.getElementById(fieldId(formId, field));
    target?.focus({ preventScroll: true });
  }
  return (
    <Link
      href={`?${field}=${value}#${formId}`}
      onClick={onClick}
      scroll={false}
      className={className}
    >
      {children}
    </Link>
  );
}

type Values = Record<string, string>;
type Checks = Record<string, string[]>;
type Errors = Record<string, string>;

export function EnquiryForm({
  formId,
  fields,
  consent,
  submitLabel,
  live,
  successText,
  intro,
}: {
  /** Prefix for field ids, and the id of the section that holds the form. */
  formId: string;
  fields: FieldSpec[];
  /** What the details will be used for, completing "use them to …". */
  consent: string;
  submitLabel: string;
  live: boolean;
  /** Shown after sending, once the form is connected. */
  successText: string;
  /** A short note above the fields. */
  intro?: ReactNode;
}) {
  const id = (name: string) => fieldId(formId, name);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const query = useQuery();

  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(
      fields
        .filter((f) => f.kind !== "checks" && !("queryKey" in f && f.queryKey))
        .map((f) => [f.name, ""]),
    ),
  );
  const [checks, setChecks] = useState<Checks>({});
  const [consented, setConsented] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  /** The current value of a field, reading choices kept in the address. */
  function valueOf(f: FieldSpec, from: Values = values): string {
    if ((f.kind === "select" || f.kind === "choice") && f.queryKey) {
      const v = query.get(f.queryKey) ?? "";
      return f.options.some((o) => o.value === v) ? v : "";
    }
    return from[f.name] ?? "";
  }

  function validate(
    v: Values,
    c: Checks,
    agreed: boolean,
    override?: [string, string],
  ): Errors {
    const e: Errors = {};
    for (const f of fields) {
      if (f.kind === "checks") {
        if (!f.optional && !(c[f.name]?.length ?? 0))
          e[f.name] = f.message ?? `Choose at least one option.`;
        continue;
      }
      const value = (
        override && override[0] === f.name ? override[1] : valueOf(f, v)
      ).trim();
      if (!value) {
        if (!f.optional)
          e[f.name] = f.message ?? `Enter ${f.label.toLowerCase()}.`;
        continue;
      }
      if (f.kind === "email" && !EMAIL.test(value))
        e[f.name] = "Enter an email address in the form name@example.com.";
      if (f.kind === "tel" && (value.match(/\d/g)?.length ?? 0) < 8)
        e[f.name] =
          "Enter a phone number with at least eight digits, or leave it blank.";
    }
    if (!agreed)
      e.consent = "Tick this box so that we can store your details and reply.";
    return e;
  }

  function set(name: string, value: string) {
    const next = { ...values, [name]: value };
    setValues(next);
    if (submitted) setErrors(validate(next, checks, consented));
  }

  function choose(f: FieldSpec & { queryKey?: string }, value: string) {
    if (f.queryKey) {
      setQuery(f.queryKey, value || null);
      if (submitted)
        setErrors(validate(values, checks, consented, [f.name, value]));
    } else set(f.name, value);
  }

  function toggle(name: string, value: string, on: boolean) {
    const list = checks[name] ?? [];
    const next = {
      ...checks,
      [name]: on ? [...list, value] : list.filter((x) => x !== value),
    };
    setChecks(next);
    if (submitted) setErrors(validate(values, next, consented));
  }

  function agree(on: boolean) {
    setConsented(on);
    if (submitted) setErrors(validate(values, checks, on));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values, checks, consented);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    // Sending is wired in Prompt 16. Until then nothing leaves the browser.
    setDone(true);
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  if (done) {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className={cn(
          "flex flex-col gap-4 rounded-m p-6 outline-none sm:p-8",
          live ? "bg-indigo-tint" : "bg-marigold-tint",
        )}
      >
        {live ? (
          <>
            <CircleCheck
              aria-hidden="true"
              size={32}
              strokeWidth={1.5}
              className="text-success"
            />
            <h3 className="font-display text-h3 font-semibold text-ink">
              Thank you
            </h3>
            <p className="text-body text-ink">{successText}</p>
          </>
        ) : (
          <>
            <h3 className="font-display text-h3 font-semibold text-ink">
              Your answers are complete, but they have not been sent
            </h3>
            <p className="text-body text-ink">
              This form is not connected yet, so nothing you entered has left
              your browser. Please come back soon. It will be switched on
              shortly.
            </p>
          </>
        )}
        <div>
          <Button variant="secondary" onClick={() => setDone(false)}>
            Back to the form
          </Button>
        </div>
      </div>
    );
  }

  const order = [...fields.map((f) => f.name), "consent"];
  const errorList = order.filter((k) => errors[k]);
  const anyOptional = fields.some((f) => f.optional);

  function errorHref(name: string) {
    const f = fields.find((x) => x.name === name);
    if (f?.kind === "checks") return `#${id(name)}-${f.options[0]?.value}`;
    return `#${id(name)}`;
  }

  function renderField(f: FieldSpec) {
    const fid = id(f.name);
    const error = errors[f.name];
    const value = f.kind === "checks" ? "" : valueOf(f);
    const span = f.width === "half" ? "" : "sm:col-span-2";

    if (f.kind === "choice") {
      const note = f.notes?.[value];
      return (
        <div key={f.name} className={cn("flex flex-col gap-3", span)}>
          <ChoiceGroup
            name={f.name}
            legend={f.label}
            hint={f.hint}
            options={f.options}
            value={value}
            onChange={(v) => choose(f, v)}
            error={error}
            idFor={id}
          />
          {note && <NoteBox note={note} />}
        </div>
      );
    }

    if (f.kind === "checks") {
      const base = id(f.name);
      return (
        <fieldset
          key={f.name}
          className={cn("flex flex-col gap-1", span)}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [f.hint && `${base}-hint`, error && `${base}-error`]
              .filter(Boolean)
              .join(" ") || undefined
          }
        >
          <legend className="mb-2 text-body font-medium text-ink">
            {f.label}
            {f.optional && (
              <span className="font-normal text-slate-600"> (optional)</span>
            )}
          </legend>
          {f.hint && (
            <p id={`${base}-hint`} className="mb-1 text-small text-slate-600">
              {f.hint}
            </p>
          )}
          {error && <ErrorText id={`${base}-error`}>{error}</ErrorText>}
          <div className="grid gap-x-6 sm:grid-cols-2">
            {f.options.map((o) => (
              <CheckRow
                key={o.value}
                id={`${base}-${o.value}`}
                name={f.name}
                value={o.value}
                checked={checks[f.name]?.includes(o.value) ?? false}
                onChange={(on) => toggle(f.name, o.value, on)}
              >
                {o.label}
              </CheckRow>
            ))}
          </div>
        </fieldset>
      );
    }

    const common = {
      id: fid,
      name: f.name,
      value,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy(fid, error, Boolean(f.hint)),
    } as const;

    let control: ReactNode;
    if (f.kind === "select") {
      control = (
        <select
          {...common}
          onChange={(e) => choose(f, e.target.value)}
          className={cn(inputClass, "appearance-auto")}
        >
          <option value="">Choose one</option>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    } else if (f.kind === "textarea") {
      control = (
        <textarea
          {...common}
          rows={f.rows ?? 6}
          maxLength={MAX_TEXT}
          onChange={(e) => set(f.name, e.target.value)}
          className={cn(inputClass, "resize-y")}
        />
      );
    } else {
      control = (
        <input
          {...common}
          type={f.kind}
          inputMode={
            f.kind === "email" ? "email" : f.kind === "tel" ? "tel" : undefined
          }
          autoComplete={f.autoComplete}
          autoCapitalize={f.kind === "text" ? "words" : "off"}
          spellCheck={f.kind === "text" ? undefined : false}
          onChange={(e) => set(f.name, e.target.value)}
          className={inputClass}
        />
      );
    }

    const note = f.kind === "select" ? f.notes?.[value] : undefined;
    return (
      <div key={f.name} className={cn("flex flex-col gap-3", span)}>
        <Field
          id={fid}
          label={f.label}
          hint={f.hint}
          error={error}
          optional={f.optional}
        >
          {control}
        </Field>
        {note && <NoteBox note={note} />}
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-describedby={`${formId}-required`}
      className="flex flex-col gap-8"
    >
      {!live && <NotConnectedNote />}
      {intro}

      {errorList.length > 0 && (
        <ErrorSummary
          summaryRef={summaryRef}
          errors={errorList.map((k) => [errorHref(k), errors[k] ?? ""])}
        />
      )}

      <p id={`${formId}-required`} className="text-small text-slate-600">
        {anyOptional
          ? "All fields are required unless marked optional."
          : "All fields are required."}
      </p>

      <div className="grid gap-8 sm:grid-cols-2">{fields.map(renderField)}</div>

      <div className="flex flex-col gap-4 border-t border-line pt-8">
        {errors.consent && (
          <ErrorText id={`${id("consent")}-error`}>{errors.consent}</ErrorText>
        )}
        <CheckRow
          id={id("consent")}
          name="consent"
          checked={consented}
          onChange={agree}
          invalid={Boolean(errors.consent)}
          describedBy={errors.consent ? `${id("consent")}-error` : undefined}
        >
          I agree that ASSOCADS may store the details on this form and use them
          to {consent}, as described in the{" "}
          <Link
            href="/legal/privacy"
            className="font-medium text-indigo underline underline-offset-4"
          >
            privacy notice
          </Link>
          .
        </CheckRow>
      </div>

      <div>
        <Button type="submit" size="large">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function NoteBox({ note }: { note: ChoiceNote }) {
  return (
    <div className="flex flex-col gap-2 rounded-s bg-indigo-tint p-4 text-small text-ink">
      <p>{note.text}</p>
      {note.href && note.linkLabel && (
        <TextLink href={note.href} className="w-fit">
          {note.linkLabel}
        </TextLink>
      )}
    </div>
  );
}
