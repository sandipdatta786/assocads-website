"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { organiseOptions } from "@/lib/enquiries";
import { setQuery, useQuery } from "@/lib/query";
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
import { FORM_ID, PROPOSE_CHAPTER, SELECT_ID } from "./communityInterest";
import {
  FormNotice,
  SentPanel,
  SpamGuards,
  SubmitButton,
  useServerForm,
} from "./serverForm";

const NOT_SURE = "not-sure";

/** A link that chooses a group or chapter in the interest form and moves to it.
    Without JavaScript it is an ordinary link to the form. */
export function InterestLink({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setQuery("interest", value);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document
      .getElementById(FORM_ID)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    document.getElementById(SELECT_ID)?.focus({ preventScroll: true });
  }
  return (
    <Link
      href={`?interest=${value}#${FORM_ID}`}
      onClick={onClick}
      scroll={false}
      className={className}
    >
      {children}
    </Link>
  );
}

const order = [
  "name",
  "email",
  "city",
  "interest",
  "place",
  "organise",
  "consent",
];

export function CommunityInterestForm({
  groups,
  chapters,
}: {
  /** Special Interest Groups, proposed and active. */
  groups: Option[];
  /** Chapters the Board has set up. */
  chapters: Option[];
}) {
  const form = useServerForm("community");
  const { errors, returned } = form;
  const id = (name: string) =>
    name === "interest" ? SELECT_ID : `${FORM_ID}-${name}`;

  // The chosen group or chapter lives in the address, so the cards above can set it.
  const allValues = [
    ...groups.map((g) => g.value),
    ...chapters.map((c) => c.value),
    PROPOSE_CHAPTER,
    NOT_SURE,
  ];
  const requested =
    useQuery().get("interest") ?? String(returned.interest ?? "");
  const interest = allValues.includes(requested) ? requested : "";

  const text = (k: string) => String(returned[k] ?? "");
  const [values, setValues] = useState({
    name: text("name"),
    email: text("email"),
    city: text("city"),
    place: text("place"),
    organise: text("organise"),
  });
  const [consented, setConsented] = useState(returned.consent === "on");

  function set(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  if (form.done) {
    return (
      <SentPanel
        state={form.state}
        resultRef={form.resultRef}
        title="Thank you"
        onBack={form.dismiss}
      >
        <p>
          We have noted your interest and sent you a short acknowledgement. We
          will write to you when the Board sets up groups and chapters.
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
          errors={errorList.map((k) => [`#${id(k)}`, errors[k] ?? ""])}
        />
      )}

      <p id={`${FORM_ID}-required`} className="text-small text-slate-600">
        All fields are required.
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
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
        <Field id={id("email")} label="Email address" error={errors.email}>
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
            aria-describedby={describedBy(id("email"), errors.email)}
            className={inputClass}
          />
        </Field>
      </div>

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

      <Field
        id={SELECT_ID}
        label="Which group or chapter interests you?"
        error={errors.interest}
      >
        <select
          id={SELECT_ID}
          name="interest"
          value={interest}
          onChange={(e) => setQuery("interest", e.target.value || null)}
          aria-invalid={errors.interest ? true : undefined}
          aria-describedby={describedBy(SELECT_ID, errors.interest)}
          className={cn(inputClass, "appearance-auto")}
        >
          <option value="">Choose one</option>
          <optgroup label="Special Interest Groups">
            {groups.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Chapters">
            {chapters.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
            <option value={PROPOSE_CHAPTER}>
              Propose a chapter in my city or state
            </option>
          </optgroup>
          <option value={NOT_SURE}>Not sure yet</option>
        </select>
      </Field>

      {interest === PROPOSE_CHAPTER && (
        <Field
          id={id("place")}
          label="City or state for the chapter"
          error={errors.place}
        >
          <input
            id={id("place")}
            name="place"
            type="text"
            autoCapitalize="words"
            value={values.place}
            onChange={(e) => set("place", e.target.value)}
            aria-invalid={errors.place ? true : undefined}
            aria-describedby={describedBy(id("place"), errors.place)}
            className={cn(inputClass, "sm:max-w-xs")}
          />
        </Field>
      )}

      <ChoiceGroup
        name="organise"
        legend="Would you like to help organise it?"
        options={[...organiseOptions]}
        value={values.organise}
        onChange={(v) => set("organise", v)}
        error={errors.organise}
        idFor={id}
      />

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
          to contact me about groups and chapters, as described in the{" "}
          <Link
            href="/legal/privacy"
            className="font-medium text-indigo underline underline-offset-4"
          >
            privacy notice
          </Link>
          .
        </CheckRow>
      </div>

      <SpamGuards kind="community" formId={FORM_ID} attempt={form.attempt} />

      <div>
        <SubmitButton pending={form.pending}>Send my interest</SubmitButton>
      </div>
    </form>
  );
}
