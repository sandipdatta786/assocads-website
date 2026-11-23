"use client";

import Link from "next/link";
import { CircleCheck } from "lucide-react";
import {
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
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
  type Option,
} from "./fields";
import { FORM_ID, PROPOSE_CHAPTER, SELECT_ID } from "./communityInterest";

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

const organiseOptions: Option[] = [
  { value: "yes", label: "Yes, I would like to help organise it" },
  { value: "maybe", label: "Maybe, tell me more" },
  { value: "no", label: "No, I would just like to take part" },
];

type Values = {
  name: string;
  email: string;
  city: string;
  place: string;
  organise: string;
  consent: boolean;
};
type Key = keyof Values | "interest";
type Errors = Partial<Record<Key, string>>;

const order: Key[] = [
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
  live,
}: {
  /** Special Interest Groups, proposed and active. */
  groups: Option[];
  /** Chapters the Board has set up. */
  chapters: Option[];
  live: boolean;
}) {
  const uid = useId();
  const id = (name: string) =>
    name === "interest" ? SELECT_ID : `${uid}-${name}`;
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // The chosen group or chapter lives in the address, so the cards above can set it.
  const allValues = [
    ...groups.map((g) => g.value),
    ...chapters.map((c) => c.value),
    PROPOSE_CHAPTER,
    NOT_SURE,
  ];
  const requested = useQuery().get("interest") ?? "";
  const interest = allValues.includes(requested) ? requested : "";

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    city: "",
    place: "",
    organise: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  function validate(v: Values, chosen: string): Errors {
    const e: Errors = {};
    if (!v.name.trim()) e.name = "Enter your full name.";
    if (!v.email.trim()) e.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
      e.email = "Enter an email address in the form name@example.com.";
    if (!v.city.trim()) e.city = "Enter the city where you live or work.";
    if (!chosen)
      e.interest = "Choose a group or a chapter, or choose Not sure yet.";
    if (chosen === PROPOSE_CHAPTER && !v.place.trim())
      e.place = "Enter the city or state for the chapter you propose.";
    if (!v.organise)
      e.organise = "Tell us whether you would like to help organise.";
    if (!v.consent)
      e.consent = "Tick this box so that we can store your details and reply.";
    return e;
  }

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (submitted) setErrors(validate(next, interest));
  }

  function choose(value: string) {
    setQuery("interest", value || null);
    if (submitted) setErrors(validate(values, value));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values, interest);
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
            <p className="text-body text-ink">
              We have noted your interest. We will write to{" "}
              {values.email.trim()} when the Board sets up groups and chapters.
            </p>
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

  const errorList = order.filter((k) => errors[k]);

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-describedby={`${uid}-required`}
      className="flex flex-col gap-8"
    >
      {!live && <NotConnectedNote />}

      {errorList.length > 0 && (
        <ErrorSummary
          summaryRef={summaryRef}
          errors={errorList.map((k) => [`#${id(k)}`, errors[k] ?? ""])}
        />
      )}

      <p id={`${uid}-required`} className="text-small text-slate-600">
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
          onChange={(e) => choose(e.target.value)}
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
        options={organiseOptions}
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
          checked={values.consent}
          onChange={(c) => set("consent", c)}
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

      <div>
        <Button type="submit" size="large">
          Send my interest
        </Button>
      </div>
    </form>
  );
}
