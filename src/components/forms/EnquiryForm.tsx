"use client";

import Link from "next/link";
import { useState, type MouseEvent, type ReactNode } from "react";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/cn";
import type { Choice, ChoiceNote } from "@/lib/enquiries";
import { MESSAGE_LIMIT, type FormKind } from "@/lib/forms/schemas";
import { setQuery, useQuery } from "@/lib/query";
import {
  CheckRow,
  ChoiceGroup,
  ErrorSummary,
  ErrorText,
  Field,
  describedBy,
  inputClass,
} from "./fields";
import {
  FormNotice,
  SentPanel,
  SpamGuards,
  SubmitButton,
  useServerForm,
} from "./serverForm";

/* One form for the site's enquiries: partnership, pledge or sponsor, and
   contact. Each page describes its fields for layout; the rules live in the
   form's schema in src/lib/forms/schemas.ts. */

type Base = {
  name: string;
  label: string;
  hint?: string;
  /** Marked "(optional)". The schema decides what is really required. */
  optional?: boolean;
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
  | (Base & { kind: "text" | "email" | "tel"; autoComplete?: string })
  | (Base & { kind: "textarea"; rows?: number })
  | (Base & { kind: "select" } & Choosing)
  | (Base & { kind: "choice" } & Choosing)
  | (Base & { kind: "checks"; options: Choice[] });

function fieldId(formId: string, name: string) {
  return `${formId}-${name}`;
}

/** A link that pre-fills one choice in a form and moves to it. Without
    JavaScript it is an ordinary link to the form. Only the choice goes in
    the address, never anything personal. */
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
    const target =
      document.querySelector<HTMLElement>(
        `input[name="${field}"][value="${value}"]`,
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

export function EnquiryForm({
  kind,
  formId,
  fields,
  consent,
  submitLabel,
  successTitle = "Thank you",
  successText,
}: {
  kind: FormKind;
  /** Prefix for field ids, and the id of the section that holds the form. */
  formId: string;
  fields: FieldSpec[];
  /** What the details will be used for, completing "use them to …". */
  consent: string;
  submitLabel: string;
  successTitle?: string;
  /** Shown after sending. */
  successText: string;
}) {
  const form = useServerForm(kind);
  const { errors, returned } = form;
  const id = (name: string) => fieldId(formId, name);
  const query = useQuery();

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields
        .filter((f) => f.kind !== "checks")
        .map((f) => [f.name, String(returned[f.name] ?? "")]),
    ),
  );
  const [checks, setChecks] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      fields
        .filter((f) => f.kind === "checks")
        .map((f) => {
          const r = returned[f.name];
          return [f.name, Array.isArray(r) ? r : []];
        }),
    ),
  );
  const [consented, setConsented] = useState(returned.consent === "on");

  /** The current value of a field, reading choices kept in the address. */
  function valueOf(f: FieldSpec): string {
    if ((f.kind === "select" || f.kind === "choice") && f.queryKey) {
      const v = query.get(f.queryKey) ?? values[f.name] ?? "";
      return f.options.some((o) => o.value === v) ? v : "";
    }
    return values[f.name] ?? "";
  }

  function set(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function choose(f: FieldSpec & { queryKey?: string }, value: string) {
    if (f.queryKey) setQuery(f.queryKey, value || null);
    set(f.name, value);
  }

  function toggle(name: string, value: string, on: boolean) {
    setChecks((prev) => {
      const list = prev[name] ?? [];
      return {
        ...prev,
        [name]: on ? [...list, value] : list.filter((x) => x !== value),
      };
    });
  }

  if (form.done) {
    return (
      <SentPanel
        state={form.state}
        resultRef={form.resultRef}
        title={successTitle}
        onBack={form.dismiss}
      >
        <p>{successText}</p>
      </SentPanel>
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
          maxLength={MESSAGE_LIMIT}
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
      {...form.formProps}
      aria-describedby={`${formId}-required`}
      className="flex flex-col gap-8"
    >
      <FormNotice state={form.state} noticeRef={form.noticeRef} />

      {errorList.length > 0 && (
        <ErrorSummary
          summaryRef={form.summaryRef}
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
          onChange={setConsented}
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

      <SpamGuards kind={kind} formId={formId} attempt={form.attempt} />

      <div>
        <SubmitButton pending={form.pending}>{submitLabel}</SubmitButton>
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
