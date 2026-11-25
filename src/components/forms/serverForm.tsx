"use client";

import { CircleCheck } from "lucide-react";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { submitForm } from "@/lib/forms/actions";
import type { FormKind, FormValues } from "@/lib/forms/limits";
import {
  HONEYPOT_FIELD,
  KIND_FIELD,
  STARTED_FIELD,
  TURNSTILE_FIELD,
  initialFormState,
  type FormState,
} from "@/lib/forms/state";

/* The browser half of the form system. Each form renders its own fields and
   uses this hook for checking, sending, focus and the result messages.
   Without JavaScript the <form action> attribute still posts to the same
   server action, and the page comes back with the result. */

/* The rules are the same Zod schemas the server uses. Zod is about 34 KB,
   so it loads when someone first moves into a form, not with the page. */
let rules: Promise<typeof import("@/lib/forms/schemas")> | null = null;
function loadRules() {
  rules ??= import("@/lib/forms/schemas").catch((error: unknown) => {
    rules = null;
    throw error;
  });
  return rules;
}

/** Only the entries of `found` whose keys are in `names`. */
function pick(found: Record<string, string>, names: readonly string[]) {
  return Object.fromEntries(
    Object.entries(found).filter(([k]) => names.includes(k)),
  );
}

function fieldOf(target: EventTarget): HTMLInputElement | null {
  const el = target as HTMLInputElement;
  return el && typeof el.name === "string" && el.name ? el : null;
}

type Options = {
  /** The fields that may show errors while the visitor corrects them. A
      form in steps passes the steps already reached; null means every field. */
  scope?: readonly string[] | null;
  /** Called when a send is refused, with every problem found, before the
      error summary takes focus: a form in steps moves to the first one. */
  onInvalid?: (errors: Record<string, string>) => void;
};

export function useServerForm(kind: FormKind, options: Options = {}) {
  const { scope = null, onInvalid } = options;
  const [state, formAction, pending] = useActionState(
    submitForm,
    initialFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>(
    state.errors ?? {},
  );
  const [checking, setChecking] = useState(state.status === "invalid");
  const [seen, setSeen] = useState(state);
  const [dismissed, setDismissed] = useState<FormState | null>(null);
  const [attempt, setAttempt] = useState(0);

  // A new result from the server: take its errors and start a fresh
  // security check, because each Turnstile token can be used once.
  if (state !== seen) {
    setSeen(state);
    setErrors(state.errors ?? {});
    if (state.status === "invalid") setChecking(true);
    setAttempt((a) => a + 1);
  }

  useEffect(() => {
    if (state.status === "idle") return;
    // Counts the send for visitor statistics: the kind of form only.
    if (state.status === "sent") trackEvent("Form sent", { form: kind });
    const target =
      state.status === "sent"
        ? resultRef
        : state.status === "invalid"
          ? summaryRef
          : noticeRef;
    requestAnimationFrame(() => target.current?.focus());
  }, [state, kind]);

  /** The first problem with each field. If the rules cannot load (the
      connection dropped), nothing is flagged and the server checks instead. */
  async function check(data?: FormData): Promise<Record<string, string>> {
    const form = formRef.current;
    if (!data && !form) return {};
    try {
      const { validateForm, fromFormData } = await loadRules();
      return validateForm(
        kind,
        fromFormData(kind, data ?? new FormData(form!)),
      );
    } catch {
      return {};
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Sending is done here rather than by React's form action, so that the
    // fields are not cleared when the server asks for corrections.
    event.preventDefault();
    if (pending) return;
    // The answers as they were when the visitor pressed send: these are
    // checked and, if they pass, sent.
    const data = new FormData(event.currentTarget);
    void check(data).then((found) => {
      // The check finishes after the click event, so the error summary is
      // put on the page at once (flushSync) before focus moves to it.
      flushSync(() => {
        setErrors(found);
        setChecking(true);
        if (Object.keys(found).length > 0) onInvalid?.(found);
      });
      if (Object.keys(found).length > 0) {
        summaryRef.current?.focus();
        return;
      }
      startTransition(() => formAction(data));
    });
  }

  /** Check some fields now, for example one step of a longer form. Shows
      their problems, keeps the others, and returns what it found. */
  async function validate(names: readonly string[]) {
    const found = pick(await check(), names);
    flushSync(() => {
      setErrors((prev) => ({
        ...Object.fromEntries(
          Object.entries(prev).filter(([k]) => !names.includes(k)),
        ),
        ...found,
      }));
      setChecking(true);
    });
    return found;
  }

  /** Re-check one field and update only its message. */
  function recheck(name: string) {
    void check().then((found) =>
      setErrors((prev) => {
        if (prev[name] === found[name]) return prev;
        const next = { ...prev };
        if (found[name]) next[name] = found[name];
        else delete next[name];
        return next;
      }),
    );
  }

  /** Once the visitor has tried to send, re-check as they correct each field.
      Before that, a field that is already flagged is re-checked as they type,
      so its message goes as soon as it is right. */
  function onChange(event: FormEvent<HTMLFormElement>) {
    if (checking) {
      void check().then((found) =>
        setErrors(scope ? pick(found, scope) : found),
      );
      return;
    }
    const field = fieldOf(event.target);
    if (field && errors[field.name]) recheck(field.name);
  }

  /** Inline checking: when someone leaves a field they have typed in, tell
      them at once if it is not right (an email address without an @, say).
      An empty field is never flagged here; that waits until they send. */
  function onBlur(event: FocusEvent<HTMLFormElement>) {
    if (checking) return;
    const field = fieldOf(event.target);
    if (
      !field ||
      field.type === "checkbox" ||
      field.type === "radio" ||
      field.type === "hidden" ||
      !field.value.trim()
    ) {
      return;
    }
    recheck(field.name);
  }

  /** Start loading the rules as soon as someone moves into the form. */
  function onFocus() {
    void loadRules().catch(() => {});
  }

  return {
    state,
    pending,
    errors,
    /** Answers returned by the server, to show again after a no-script post. */
    returned: state.values ?? ({} as FormValues),
    done: state.status === "sent" && dismissed !== state,
    dismiss: () => setDismissed(state),
    validate,
    attempt,
    summaryRef,
    resultRef,
    noticeRef,
    formProps: {
      ref: formRef,
      action: formAction,
      onSubmit,
      onChange,
      onBlur,
      onFocus,
      noValidate: true,
    },
  };
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const subscribeNever = () => () => {};

/** Which form this is, the hidden honeypot, the time the form appeared,
    and Turnstile. */
export function SpamGuards({
  kind,
  formId,
  attempt,
}: {
  kind: FormKind;
  formId: string;
  attempt: number;
}) {
  // When the form first appeared in this browser. Empty in the server's HTML,
  // so a post without JavaScript carries no time at all.
  const startedAt = useRef(0);
  const started = useSyncExternalStore(
    subscribeNever,
    () => (startedAt.current ||= Date.now()),
    () => 0,
  );

  return (
    <>
      <input type="hidden" name={KIND_FIELD} value={kind} />
      <input
        type="hidden"
        name={STARTED_FIELD}
        value={started ? String(started) : ""}
      />
      {/* People never see this field. Automated senders tend to fill it in. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${formId}-${HONEYPOT_FIELD}`}>
          Leave this field empty
        </label>
        <input
          id={`${formId}-${HONEYPOT_FIELD}`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      {SITE_KEY && <Turnstile key={attempt} siteKey={SITE_KEY} />}
    </>
  );
}

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error("Turnstile did not load"));
    };
    document.head.append(script);
  });
  return loading;
}

/** Cloudflare Turnstile, rendered explicitly so it survives page changes.
    It adds a hidden cf-turnstile-response field to the form. Its script
    loads only when the form comes within a screen's height of view, or
    someone moves into the form, so pages open without a third party. */
function Turnstile({ siteKey }: { siteKey: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let id: string | undefined;
    let cancelled = false;
    let started = false;
    const form = el.closest("form");
    const start = () => {
      if (started) return;
      started = true;
      observer?.disconnect();
      form?.removeEventListener("focusin", start);
      loadTurnstile()
        .then(() => {
          if (cancelled || !ref.current || !window.turnstile) return;
          id = window.turnstile.render(ref.current, {
            sitekey: siteKey,
            theme: "light",
            size: "flexible",
            language: "en",
            "response-field-name": TURNSTILE_FIELD,
          });
        })
        .catch(() => {});
    };
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => entries.some((e) => e.isIntersecting) && start(),
            { rootMargin: "100% 0px" },
          )
        : null;
    if (observer) observer.observe(el);
    else start();
    form?.addEventListener("focusin", start);
    return () => {
      cancelled = true;
      observer?.disconnect();
      form?.removeEventListener("focusin", start);
      if (id) window.turnstile?.remove(id);
    };
  }, [siteKey]);
  return <div ref={ref} className="min-h-16 max-w-sm" />;
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: ReactNode;
}) {
  return (
    <Button
      type="submit"
      size="large"
      disabled={pending}
      aria-disabled={pending || undefined}
    >
      {pending ? "Sending…" : children}
    </Button>
  );
}

function EmailLink({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="font-medium break-words text-indigo underline underline-offset-4"
    >
      {email}
    </a>
  );
}

/** A problem that is not about one field: shown above the form, and focused. */
export function FormNotice({
  state,
  noticeRef,
}: {
  state: FormState;
  noticeRef: React.RefObject<HTMLDivElement | null>;
}) {
  const email = state.contactEmail;
  const orEmail = email ? (
    <>
      , or email us at <EmailLink email={email} />
    </>
  ) : null;

  let title: string;
  let body: ReactNode;
  switch (state.status) {
    case "too-fast":
      title = "That was quicker than we expected";
      body = "Please check your answers and send the form again.";
      break;
    case "security":
      title = "The security check did not complete";
      body =
        "Please wait for the check above the button to finish, then send again. If it keeps failing, refresh the page.";
      break;
    case "needs-js":
      title = "Please switch on JavaScript to send this form";
      body = (
        <>
          The form uses a security check that needs JavaScript. Your answers are
          kept below. Switch on JavaScript and send again{orEmail}.
        </>
      );
      break;
    case "rate-limited":
      title = "Too many messages from your connection";
      body = <>Please wait ten minutes and try again{orEmail}.</>;
      break;
    case "failed":
      title = "Sorry, we could not send this";
      body = (
        <>Nothing was lost on your side. Please try again later{orEmail}.</>
      );
      break;
    default:
      return null;
  }
  return (
    <div
      ref={noticeRef}
      tabIndex={-1}
      role="alert"
      className="rounded-s border-2 border-error bg-paper p-4 outline-none sm:p-5"
    >
      <h2 className="font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-small text-ink">{body}</p>
    </div>
  );
}

/** Shown in place of the form once it has been sent. */
export function SentPanel({
  state,
  resultRef,
  title,
  children,
  next,
  onBack,
  backLabel = "Back to the form",
}: {
  state: FormState;
  resultRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  children: ReactNode;
  /** "What happens next", one step per item, in order. */
  next?: ReactNode[];
  onBack: () => void;
  backLabel?: string;
}) {
  const local = state.mode === "terminal" || state.mode === "test";
  return (
    <div
      ref={resultRef}
      tabIndex={-1}
      role="status"
      className="flex flex-col gap-4 rounded-m bg-indigo-tint p-6 outline-none sm:p-8"
    >
      <CircleCheck
        aria-hidden="true"
        size={32}
        strokeWidth={1.5}
        className="text-success"
      />
      <h2 className="font-display text-h3 font-semibold text-ink">{title}</h2>
      <div className="text-body text-ink">{children}</div>
      {next && next.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-body font-semibold text-ink">
            What happens next
          </h3>
          <ol className="flex flex-col gap-3 text-body text-ink">
            {next.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-paper font-mono text-small font-semibold text-indigo"
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {local && (
        <p className={cn("rounded-s bg-marigold-tint p-4 text-small text-ink")}>
          <strong>
            {state.mode === "test" ? "Test mode." : "Development mode."}
          </strong>{" "}
          {state.mode === "test"
            ? "Nothing was emailed. The message was saved for the automated tests."
            : "Nothing was emailed, because the email keys are not set. The message was printed in the terminal where the site is running."}
        </p>
      )}
      <div>
        <Button variant="secondary" onClick={onBack}>
          {backLabel}
        </Button>
      </div>
    </div>
  );
}
