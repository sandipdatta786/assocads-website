"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { membershipCategories, membershipRoles } from "@/lib/enquiries";
import { MEMBERSHIP_MESSAGE_LIMIT } from "@/lib/forms/schemas";
import {
  CheckRow,
  ChoiceGroup,
  ErrorSummary,
  ErrorText,
  Field,
  describedBy,
  inputClass,
  type Option,
} from "./fields";
import {
  FormNotice,
  SentPanel,
  SpamGuards,
  SubmitButton,
  useServerForm,
} from "./serverForm";

const FORM_ID = "register-interest";

/** Field order, for the error summary. */
const order = [
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
}: {
  /** The eight programmes, for "Areas of interest". */
  programmes: Option[];
}) {
  const form = useServerForm("membership");
  const { errors, returned } = form;
  const id = (name: string) => `${FORM_ID}-${name}`;

  const text = (k: string) => String(returned[k] ?? "");
  const [values, setValues] = useState({
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    city: text("city"),
    role: text("role"),
    organisation: text("organisation"),
    category: text("category"),
    message: text("message"),
  });
  const [areas, setAreas] = useState<string[]>(() =>
    Array.isArray(returned.areas) ? returned.areas : [],
  );
  const [consented, setConsented] = useState(returned.consent === "on");
  const [updates, setUpdates] = useState(returned.updates === "on");

  function set(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArea(slug: string) {
    setAreas((prev) =>
      prev.includes(slug) ? prev.filter((a) => a !== slug) : [...prev, slug],
    );
  }

  if (form.done) {
    return (
      <SentPanel
        state={form.state}
        resultRef={form.resultRef}
        title="Thank you"
        onBack={form.dismiss}
        backLabel="Register someone else"
      >
        <p>
          We have your details and have sent you a short acknowledgement. We
          will write to you when membership opens. Nothing more is needed from
          you now.
        </p>
      </SentPanel>
    );
  }

  const errorList = order.filter((k) => errors[k]);

  return (
    <form
      {...form.formProps}
      aria-describedby={`${FORM_ID}-required`}
      className="flex flex-col gap-8"
    >
      <FormNotice state={form.state} noticeRef={form.noticeRef} />

      {errorList.length > 0 && (
        <ErrorSummary
          summaryRef={form.summaryRef}
          errors={errorList.map((k) => [
            `#${id(k === "areas" ? "areas-0" : k)}`,
            errors[k] ?? "",
          ])}
        />
      )}

      <p id={`${FORM_ID}-required`} className="text-small text-slate-600">
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
        options={[...membershipRoles]}
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
        options={[...membershipCategories]}
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
              checked={areas.includes(p.value)}
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
            values.message.length > MEMBERSHIP_MESSAGE_LIMIT
              ? "text-error"
              : "text-slate-600",
          )}
        >
          {values.message.length} of {MEMBERSHIP_MESSAGE_LIMIT} characters
        </p>
      </Field>

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
          checked={updates}
          onChange={setUpdates}
        >
          Also send me occasional news about ASSOCADS events and programmes.
          (Optional. You can stop these at any time.)
        </CheckRow>
      </div>

      <SpamGuards kind="membership" formId={FORM_ID} attempt={form.attempt} />

      <div>
        <SubmitButton pending={form.pending}>
          Register your interest
        </SubmitButton>
      </div>
    </form>
  );
}
