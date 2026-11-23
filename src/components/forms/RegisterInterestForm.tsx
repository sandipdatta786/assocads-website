"use client";

import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  CheckRow,
  ChoiceGroup,
  ErrorSummary,
  ErrorText,
  NotConnectedNote,
  Field,
  describedBy,
  inputClass,
  type Option,
} from "./fields";

const roles: Option[] = [
  { value: "student", label: "A student" },
  { value: "professional", label: "A working professional" },
  { value: "faculty-researcher", label: "Faculty or a researcher" },
  { value: "organisation", label: "Representing an organisation" },
  { value: "other", label: "Other" },
];

const categories: Option[] = [
  { value: "ordinary", label: "Ordinary membership" },
  { value: "life", label: "Life membership" },
  { value: "associate", label: "Associate membership (for organisations)" },
  { value: "not-sure", label: "Not sure yet" },
];

type Values = {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  organisation: string;
  category: string;
  areas: string[];
  message: string;
  consent: boolean;
  updates: boolean;
};

type Errors = Partial<Record<keyof Values, string>>;

const MESSAGE_LIMIT = 1000;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Enter your full name.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = "Enter an email address in the form name@example.com.";
  if (v.phone.trim() && !/^[+()\d\s-]{7,20}$/.test(v.phone.trim()))
    e.phone = "Enter a phone number using digits only, or leave it blank.";
  if (!v.city.trim()) e.city = "Enter the city where you live or work.";
  if (!v.role) e.role = "Choose the option that describes you best.";
  if (v.role === "organisation" && !v.organisation.trim())
    e.organisation = "Enter the name of the organisation you represent.";
  if (!v.category) e.category = "Choose a category, or choose Not sure yet.";
  if (v.message.length > MESSAGE_LIMIT)
    e.message = `Keep your message under ${MESSAGE_LIMIT} characters.`;
  if (!v.consent)
    e.consent = "Tick this box so that we can store your details and reply.";
  return e;
}

/** Field order, so the first error can receive focus. */
const order: (keyof Values)[] = [
  "name",
  "email",
  "phone",
  "city",
  "role",
  "organisation",
  "category",
  "areas",
  "message",
  "consent",
];

export function RegisterInterestForm({
  programmes,
  live,
}: {
  /** The eight programmes, for "Areas of interest". */
  programmes: Option[];
  /** Whether submissions are actually sent. False until Prompt 16 wires the form. */
  live: boolean;
}) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    city: "",
    role: "",
    organisation: "",
    category: "",
    areas: [],
    message: "",
    consent: false,
    updates: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState<"editing" | "done">("editing");

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    // Once the visitor has tried to submit, re-check as they correct each field.
    if (submitted) setErrors(validate(next));
  }

  function toggleArea(slug: string) {
    set(
      "areas",
      values.areas.includes(slug)
        ? values.areas.filter((a) => a !== slug)
        : [...values.areas, slug],
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    // Sending is wired in Prompt 16. Until then nothing leaves the browser.
    setState("done");
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  function startAgain() {
    setState("editing");
    requestAnimationFrame(() =>
      formRef.current?.querySelector<HTMLInputElement>("input")?.focus(),
    );
  }

  if (state === "done") {
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
            <h2 className="font-display text-h3 font-semibold text-ink">
              Thank you, {values.name.trim().split(/\s+/)[0]}
            </h2>
            <p className="text-body text-ink">
              We have your details. We will write to {values.email.trim()} when
              membership opens. Nothing more is needed from you now.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-display text-h3 font-semibold text-ink">
              Your answers are complete, but they have not been sent
            </h2>
            <p className="text-body text-ink">
              This form is not connected yet, so nothing you entered has left
              your browser. Please come back soon. It will be switched on
              shortly.
            </p>
          </>
        )}
        <div>
          <Button variant="secondary" onClick={startAgain}>
            {live ? "Register someone else" : "Back to the form"}
          </Button>
        </div>
      </div>
    );
  }

  const errorList = order.filter((k) => errors[k]);

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-describedby={`${uid}-required`}
      className="flex flex-col gap-8"
    >
      {!live && <NotConnectedNote />}

      {errorList.length > 0 && (
        <ErrorSummary
          summaryRef={summaryRef}
          errors={errorList.map((k) => [
            `#${id(k === "areas" ? "areas-0" : k)}`,
            errors[k] ?? "",
          ])}
        />
      )}

      <p id={`${uid}-required`} className="text-small text-slate-600">
        All fields are required unless they say optional.
      </p>

      <Field id={id("name")} label="Full name" error={errors.name}>
        <input
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          spellCheck={false}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy(id("name"), errors.name)}
          className={inputClass}
        />
      </Field>

      <Field
        id={id("email")}
        label="Email address"
        hint="We will use this to tell you when membership opens."
        error={errors.email}
      >
        <input
          id={id("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy(id("email"), errors.email, true)}
          className={inputClass}
        />
      </Field>

      <Field
        id={id("phone")}
        label="Phone number"
        optional
        error={errors.phone}
      >
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={describedBy(id("phone"), errors.phone)}
          className={cn(inputClass, "sm:max-w-xs")}
        />
      </Field>

      <Field id={id("city")} label="City" error={errors.city}>
        <input
          id={id("city")}
          name="city"
          type="text"
          autoComplete="address-level2"
          autoCapitalize="words"
          value={values.city}
          onChange={(e) => set("city", e.target.value)}
          aria-invalid={errors.city ? true : undefined}
          aria-describedby={describedBy(id("city"), errors.city)}
          className={cn(inputClass, "sm:max-w-xs")}
        />
      </Field>

      <ChoiceGroup
        name="role"
        legend="I am"
        options={roles}
        value={values.role}
        onChange={(v) => set("role", v)}
        error={errors.role}
        idFor={id}
      />

      <Field
        id={id("organisation")}
        label="Organisation or institution"
        optional={values.role !== "organisation"}
        hint="Your college, university, employer or the organisation you represent."
        error={errors.organisation}
      >
        <input
          id={id("organisation")}
          name="organisation"
          type="text"
          autoComplete="organization"
          value={values.organisation}
          onChange={(e) => set("organisation", e.target.value)}
          aria-invalid={errors.organisation ? true : undefined}
          aria-describedby={describedBy(
            id("organisation"),
            errors.organisation,
            true,
          )}
          className={inputClass}
        />
      </Field>

      <ChoiceGroup
        name="category"
        legend="Category of interest"
        hint={
          <>
            Honorary membership is by invitation of the Board, so it is not
            listed.{" "}
            <Link
              href="/membership#categories"
              className="font-medium text-indigo underline underline-offset-4"
            >
              Compare the categories
            </Link>
          </>
        }
        options={categories}
        value={values.category}
        onChange={(v) => set("category", v)}
        error={errors.category}
        idFor={id}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-body font-medium text-ink">
          Areas of interest
          <span className="font-normal text-slate-600"> (optional)</span>
        </legend>
        <p className="-mt-1 text-small text-slate-600">
          Choose as many as you like.
        </p>
        <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {programmes.map((p, i) => (
            <CheckRow
              key={p.value}
              id={id(`areas-${i}`)}
              name="areas"
              value={p.value}
              checked={values.areas.includes(p.value)}
              onChange={() => toggleArea(p.value)}
            >
              {p.label}
            </CheckRow>
          ))}
        </div>
      </fieldset>

      <Field
        id={id("message")}
        label="Message"
        optional
        hint="Anything you would like us to know."
        error={errors.message}
      >
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy(id("message"), errors.message, true)}
          className={cn(inputClass, "min-h-32 resize-y")}
        />
        <p
          className={cn(
            "text-caption",
            values.message.length > MESSAGE_LIMIT
              ? "text-error"
              : "text-slate-600",
          )}
        >
          {values.message.length} of {MESSAGE_LIMIT} characters
        </p>
      </Field>

      <div className="flex flex-col gap-4 border-t border-line pt-8">
        {errors.consent && (
          <ErrorText id={`${id("consent")}-error`}>{errors.consent}</ErrorText>
        )}
        <CheckRow
          id={id("consent")}
          name="consent"
          checked={values.consent}
          onChange={(c) => set("consent", c)}
          invalid={Boolean(errors.consent)}
          describedBy={errors.consent ? `${id("consent")}-error` : undefined}
        >
          I agree that ASSOCADS may store the details on this form and use them
          to contact me about membership, as described in the{" "}
          <Link
            href="/legal/privacy"
            className="font-medium text-indigo underline underline-offset-4"
          >
            privacy notice
          </Link>
          .
        </CheckRow>
        <CheckRow
          id={id("updates")}
          name="updates"
          checked={values.updates}
          onChange={(c) => set("updates", c)}
        >
          Also send me occasional news about ASSOCADS events and programmes.
          (Optional. You can stop these at any time.)
        </CheckRow>
      </div>

      <div>
        <Button type="submit" size="large">
          Register your interest
        </Button>
      </div>
    </form>
  );
}
