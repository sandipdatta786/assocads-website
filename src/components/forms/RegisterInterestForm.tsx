"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { membershipRoles } from "@/lib/enquiries";
import { MEMBERSHIP_MESSAGE_LIMIT } from "@/lib/forms/limits";
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

/** One category, as the comparison on the category step shows it. */
export type CategoryCard = {
  value: string;
  group: "individual" | "organisation";
  name: string;
  eligibility: string;
  /** What it costs, in words. */
  payment: string;
};

/** The three steps, and the fields each one holds, in page order. */
const STEPS = [
  {
    title: "About you",
    fields: ["name", "email", "phone", "city", "role", "organisation"],
  },
  { title: "Category", fields: ["category"] },
  {
    title: "Interests and consent",
    fields: ["areas", "message", "consent", "updates"],
  },
] as const;

const LAST = STEPS.length - 1;
const ORDER: string[] = STEPS.flatMap((s) => [...s.fields]);

function stepOf(name: string): number {
  return STEPS.findIndex((s) => (s.fields as readonly string[]).includes(name));
}

/* ---------- The draft kept in this browser tab ---------- */

/* Answers are kept in session storage as the visitor goes, so a reload or an
   accidental Back does not lose them. Session storage is cleared when the tab
   closes, which matters on a shared computer, and the draft is removed as
   soon as the form is sent. Consent is never kept: it is given afresh. */

const DRAFT_KEY = "assocads:membership-draft";

type Answers = {
  values: Record<(typeof TEXT_FIELDS)[number], string>;
  areas: string[];
  updates: boolean;
};

const TEXT_FIELDS = [
  "name",
  "email",
  "phone",
  "city",
  "role",
  "organisation",
  "category",
  "message",
] as const;

function isAnswers(v: unknown): v is Answers {
  if (!v || typeof v !== "object") return false;
  const a = v as Answers;
  return (
    typeof a.values === "object" &&
    a.values !== null &&
    TEXT_FIELDS.every((k) => typeof a.values[k] === "string") &&
    Array.isArray(a.areas) &&
    a.areas.every((x) => typeof x === "string") &&
    typeof a.updates === "boolean"
  );
}

function hasAnything(a: Answers): boolean {
  return (
    TEXT_FIELDS.some((k) => a.values[k].trim()) ||
    a.areas.length > 0 ||
    a.updates
  );
}

let draftCache: Answers | null | undefined;

function readDraft(): Answers | null {
  if (draftCache === undefined) {
    draftCache = null;
    try {
      const parsed: unknown = JSON.parse(
        sessionStorage.getItem(DRAFT_KEY) ?? "null",
      );
      if (isAnswers(parsed) && hasAnything(parsed)) draftCache = parsed;
    } catch {
      // Storage blocked or the draft unreadable: start with an empty form.
    }
  }
  return draftCache;
}

function forgetDraft() {
  draftCache = null;
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {}
}

const subscribeNever = () => () => {};

/* ---------- The form ---------- */

export function RegisterInterestForm({
  programmes,
  categories,
}: {
  /** The eight programmes, for "Areas of interest". */
  programmes: Option[];
  /** The categories someone can register interest in, for the comparison. */
  categories: CategoryCard[];
}) {
  // The server's HTML is already in steps, so nothing moves when the page
  // loads. Without JavaScript a <noscript> style shows every step at once as
  // one long form, which still posts to the server. This flag is false only
  // in that HTML, before JavaScript runs.
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const draft = useSyncExternalStore(subscribeNever, readDraft, () => null);

  const [step, setStep] = useState(0);
  /** The furthest step whose Continue (or send) has been pressed. */
  const [tried, setTried] = useState(-1);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Fields that may show errors while being corrected: the steps already
  // passed, and this one once Continue has been pressed on it.
  const scope = STEPS.slice(0, tried >= step ? step + 1 : step).flatMap((s) => [
    ...s.fields,
  ]);

  const form = useServerForm("membership", {
    scope,
    onInvalid: (found) => {
      const first = Math.min(
        ...Object.keys(found)
          .map(stepOf)
          .filter((i) => i >= 0),
      );
      if (Number.isFinite(first)) {
        setStep(first);
        setTried((t) => Math.max(t, first));
      }
    },
  });
  const { errors, returned } = form;
  const id = (name: string) => `${FORM_ID}-${name}`;

  // Answers the server sent back after a post without JavaScript.
  const text = (k: string) => String(returned[k] ?? "");
  const fromServer: Answers = {
    values: Object.fromEntries(
      TEXT_FIELDS.map((k) => [k, text(k)]),
    ) as Answers["values"],
    areas: Array.isArray(returned.areas) ? returned.areas : [],
    updates: returned.updates === "on",
  };
  const [own, setOwn] = useState<Answers | null>(null);
  const [consented, setConsented] = useState(returned.consent === "on");
  const [cleared, setCleared] = useState(false);

  const usingDraft = !own && !cleared && !hasAnything(fromServer) && !!draft;
  const answers = own ?? (usingDraft ? draft : fromServer);
  const { values, areas, updates } = answers;

  // A refusal from the server: go to the first step with a problem.
  const [seen, setSeen] = useState(form.state);
  if (form.state !== seen) {
    setSeen(form.state);
    if (form.state.status === "invalid" && form.state.errors) {
      const first = Math.min(
        ...Object.keys(form.state.errors)
          .map(stepOf)
          .filter((i) => i >= 0),
      );
      if (Number.isFinite(first)) {
        setStep(first);
        setTried((t) => Math.max(t, first));
      }
    }
  }

  // Keep the draft as the visitor types; remove it once the form is sent.
  useEffect(() => {
    if (!own) return;
    try {
      if (hasAnything(own))
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(own));
      else sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
  }, [own]);

  const sent = form.state.status === "sent";
  useEffect(() => {
    if (sent) forgetDraft();
  }, [sent]);

  function update(change: (a: Answers) => Answers) {
    setOwn((prev) => change(prev ?? answers));
  }

  function set(key: (typeof TEXT_FIELDS)[number], value: string) {
    update((a) => ({ ...a, values: { ...a.values, [key]: value } }));
  }

  function toggleArea(slug: string) {
    update((a) => ({
      ...a,
      areas: a.areas.includes(slug)
        ? a.areas.filter((x) => x !== slug)
        : [...a.areas, slug],
    }));
  }

  function startAgain() {
    forgetDraft();
    flushSync(() => {
      setCleared(true);
      setOwn({
        values: Object.fromEntries(
          TEXT_FIELDS.map((k) => [k, ""]),
        ) as Answers["values"],
        areas: [],
        updates: false,
      });
      setConsented(false);
      setStep(0);
      setTried(-1);
    });
    headingRef.current?.focus();
  }

  function goTo(next: number) {
    flushSync(() => setStep(next));
    headingRef.current?.focus();
  }

  async function onContinue() {
    setTried((t) => Math.max(t, step));
    const found = await form.validate(STEPS[step].fields);
    if (Object.keys(found).length > 0) {
      form.summaryRef.current?.focus();
      return;
    }
    goTo(step + 1);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Enter in a field before the last step means Continue, not send.
    if (step < LAST) {
      event.preventDefault();
      void onContinue();
      return;
    }
    setTried(LAST);
    form.formProps.onSubmit(event);
  }

  if (form.done) {
    return (
      <SentPanel
        state={form.state}
        resultRef={form.resultRef}
        title="Thank you"
        onBack={form.dismiss}
        backLabel="Register someone else"
        next={[
          "We have emailed you a short acknowledgement. If it has not arrived, look in your spam folder.",
          "Membership opens after the trust is registered. We will write to you then.",
          "You can then apply in the category that suits you, at the fees on the membership page.",
          <>
            Until then, nothing more is needed from you. To change or erase your
            details at any time,{" "}
            <Link
              href="/contact"
              className="font-medium text-indigo underline underline-offset-4"
            >
              contact us
            </Link>
            .
          </>,
        ]}
      >
        <p>
          Your interest in membership is registered. Registering is not an
          application, and it commits you to nothing.
        </p>
      </SentPanel>
    );
  }

  // After a post without JavaScript every step shows, so the summary lists
  // every problem. In steps, it lists only this step's, which are on screen.
  const errorList = ORDER.filter(
    (k) => errors[k] && (!hydrated || stepOf(k) === step),
  );

  return (
    <form
      {...form.formProps}
      id={FORM_ID}
      onSubmit={onSubmit}
      aria-describedby={`${FORM_ID}-required`}
      className="flex flex-col gap-8"
    >
      {/* Without JavaScript, show every step and hide the step buttons. */}
      <noscript>
        {/* In Tailwind's base layer, so it can outrank its [hidden] rule:
            an !important rule in a layer beats one outside every layer. */}
        <style>{`@layer base{#${FORM_ID} [data-form-step][hidden],#${FORM_ID} [data-form-submit][hidden]{display:flex!important}#${FORM_ID} [data-step-nav]{display:none!important}}`}</style>
      </noscript>

      <Progress step={step} onGoTo={goTo} />

      <FormNotice state={form.state} noticeRef={form.noticeRef} />

      {usingDraft && (
        <div className="flex flex-col gap-2 rounded-s bg-indigo-tint p-4 text-small text-ink sm:flex-row sm:items-center sm:justify-between">
          <p>We have filled in the answers you started earlier in this tab.</p>
          <button
            type="button"
            onClick={startAgain}
            className="min-h-11 self-start font-medium text-indigo underline underline-offset-4 sm:self-auto"
          >
            Clear them and start again
          </button>
        </div>
      )}

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
        All fields are required unless they say optional.{" "}
        <span data-step-nav="">
          Your answers are kept in this tab as you go, until you send the form
          or close the tab.
        </span>
      </p>

      {/* Step 1: about you */}
      <Step
        index={0}
        shown={step === 0}
        headingRef={step === 0 ? headingRef : undefined}
      >
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
      </Step>

      {/* Step 2: category, with the categories side by side */}
      <Step
        index={1}
        shown={step === 1}
        headingRef={step === 1 ? headingRef : undefined}
      >
        <CategoryChoice
          categories={categories}
          value={values.category}
          onChange={(v) => set("category", v)}
          error={errors.category}
          idFor={id}
        />
      </Step>

      {/* Step 3: interests and consent */}
      <Step
        index={2}
        shown={step === 2}
        headingRef={step === 2 ? headingRef : undefined}
      >
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
            <ErrorText id={`${id("consent")}-error`}>
              {errors.consent}
            </ErrorText>
          )}
          <CheckRow
            id={id("consent")}
            name="consent"
            checked={consented}
            onChange={setConsented}
            invalid={Boolean(errors.consent)}
            describedBy={errors.consent ? `${id("consent")}-error` : undefined}
          >
            I agree that ASSOCADS may store the details on this form and use
            them to contact me about membership, as described in the{" "}
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
            onChange={(on) => update((a) => ({ ...a, updates: on }))}
          >
            Also send me occasional news about ASSOCADS events and programmes.
            (Optional. You can stop these at any time.)
          </CheckRow>
        </div>

        <SpamGuards kind="membership" formId={FORM_ID} attempt={form.attempt} />
      </Step>

      {/* The buttons. Continue checks this step before moving on. */}
      <div className="flex flex-wrap items-center gap-4">
        <div data-form-submit="" hidden={step !== LAST}>
          <SubmitButton pending={form.pending}>
            Register your interest
          </SubmitButton>
        </div>
        {step < LAST && (
          <Button
            type="button"
            size="large"
            data-step-nav=""
            onClick={() => void onContinue()}
          >
            Continue
          </Button>
        )}
        {step > 0 && (
          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={() => goTo(step - 1)}
          >
            Back
          </Button>
        )}
      </div>
    </form>
  );
}

/* ---------- Pieces ---------- */

function Step({
  index,
  shown,
  headingRef,
  children,
}: {
  index: number;
  shown: boolean;
  headingRef?: React.RefObject<HTMLHeadingElement | null>;
  children: React.ReactNode;
}) {
  return (
    <section
      data-form-step=""
      hidden={!shown}
      aria-labelledby={`${FORM_ID}-step-${index}`}
      className="flex flex-col gap-8"
    >
      <h2
        id={`${FORM_ID}-step-${index}`}
        ref={headingRef}
        tabIndex={-1}
        className="scroll-mt-28 font-display text-h3 font-semibold text-ink outline-none"
      >
        <span className="block font-mono text-caption font-medium tracking-wide text-slate-600 uppercase">
          Step {index + 1} of {STEPS.length}
          <span className="sr-only">:</span>
        </span>{" "}
        {STEPS[index].title}
      </h2>
      {children}
    </section>
  );
}

/** Where the visitor is: three numbered steps and a bar. Steps already
    passed are buttons, to go back to them. Hidden without JavaScript. */
function Progress({
  step: current,
  onGoTo,
}: {
  step: number;
  onGoTo: (step: number) => void;
}) {
  return (
    <div data-step-nav="" className="flex flex-col gap-3">
      <ol aria-label="Form steps" className="grid grid-cols-3 gap-2">
        {STEPS.map((s, i) => {
          const done = i < current;
          const here = i === current;
          const inner = (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-small font-semibold",
                  done && "border-indigo bg-indigo text-paper",
                  here && "border-indigo bg-indigo-tint text-indigo",
                  !done && !here && "border-slate-400 text-slate-600",
                )}
              >
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-caption leading-snug",
                  here ? "font-semibold text-ink" : "text-slate-600",
                )}
              >
                <span className="sr-only">
                  Step {i + 1}
                  {done ? ", done" : ""}:{" "}
                </span>
                {s.title}
              </span>
            </>
          );
          return (
            <li key={s.title} aria-current={here ? "step" : undefined}>
              {done ? (
                <button
                  type="button"
                  onClick={() => onGoTo(i)}
                  className="flex min-h-11 w-full flex-col items-start gap-1.5 rounded-s text-left hover:[&>span:last-child]:text-ink hover:[&>span:last-child]:underline"
                >
                  {inner}
                </button>
              ) : (
                <div className="flex min-h-11 flex-col items-start gap-1.5">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div
        aria-hidden="true"
        className="h-1 overflow-hidden rounded-full bg-cloud"
      >
        <div
          className="h-full origin-left rounded-full bg-indigo motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out"
          style={{ transform: `scaleX(${(current + 1) / STEPS.length})` }}
        />
      </div>
    </div>
  );
}

/** The categories as cards, individuals then organisations, each a radio
    button with who can join and what it costs. "Not sure yet" below. */
function CategoryChoice({
  categories,
  value,
  onChange,
  error,
  idFor,
}: {
  categories: CategoryCard[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  idFor: (name: string) => string;
}) {
  const base = idFor("category");
  const radioId = (i: number, v: string) => (i === 0 ? base : `${base}-${v}`);
  return (
    <fieldset
      className="flex flex-col gap-4"
      aria-invalid={error ? true : undefined}
      aria-describedby={[`${base}-hint`, error && `${base}-error`]
        .filter(Boolean)
        .join(" ")}
    >
      <legend className="mb-1 text-body font-medium text-ink">
        Category of interest
      </legend>
      <p id={`${base}-hint`} className="-mt-2 text-small text-slate-600">
        Choose the one that fits you best. Honorary recognition is by invitation
        of the Board, so it is not listed.
      </p>
      {error && <ErrorText id={`${base}-error`}>{error}</ErrorText>}
      {(
        [
          ["individual", "For individuals"],
          ["organisation", "For organisations"],
        ] as const
      ).map(([group, heading]) => (
        <div key={group} className="flex flex-col gap-3">
          <p className="mt-2 font-mono text-eyebrow font-medium text-slate-600 uppercase">
            {heading}
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {categories.map((c, i) => {
              if (c.group !== group) return null;
              const rid = radioId(i, c.value);
              return (
                <div
                  key={c.value}
                  className={cn(
                    "relative flex flex-col gap-2 rounded-m border bg-paper p-4 transition-[border-color,background-color] duration-150 ease-out",
                    "has-[:checked]:border-indigo has-[:checked]:bg-indigo-tint has-[:checked]:shadow-[inset_0_0_0_1px_var(--indigo)]",
                    "has-[:focus-visible]:shadow-[0_0_0_4px_var(--indigo-tint)]",
                    error ? "border-error" : "border-line hover:border-ink",
                  )}
                >
                  <label
                    htmlFor={rid}
                    className="flex min-h-11 cursor-pointer items-center gap-3 font-display text-body font-semibold text-ink after:absolute after:inset-0 after:rounded-m"
                  >
                    <input
                      id={rid}
                      type="radio"
                      name="category"
                      value={c.value}
                      checked={value === c.value}
                      onChange={() => onChange(c.value)}
                      aria-describedby={`${rid}-details`}
                      className="relative z-1 size-5 shrink-0 accent-indigo"
                    />
                    {c.name}
                  </label>
                  <p
                    id={`${rid}-details`}
                    className="flex flex-col gap-1 pl-8 text-small text-slate-600"
                  >
                    <span>{c.eligibility}</span>
                    <span className="font-medium text-ink">{c.payment}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <label
        htmlFor={`${base}-not-sure`}
        className="flex min-h-11 cursor-pointer items-center gap-3 text-body text-ink"
      >
        <input
          id={`${base}-not-sure`}
          type="radio"
          name="category"
          value="not-sure"
          checked={value === "not-sure"}
          onChange={() => onChange("not-sure")}
          className="size-5 shrink-0 accent-indigo"
        />
        Not sure yet
      </label>
      <p className="text-small text-slate-600">
        <Link
          href="/membership#categories"
          className="font-medium text-indigo underline underline-offset-4"
        >
          More about each category
        </Link>
      </p>
    </fieldset>
  );
}
