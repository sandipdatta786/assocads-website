"use client";

import { CircleAlert } from "lucide-react";
import type { ReactNode, RefObject } from "react";

/* Building blocks shared by the site's forms: labels above fields, errors
   beside the field they belong to, and large touch targets. */

export type Option = { value: string; label: string };

export const inputClass =
  "block w-full min-h-12 rounded-s border border-slate-500 bg-paper px-4 py-3 text-body text-ink " +
  "placeholder:text-slate-500 focus-visible:border-indigo " +
  "aria-invalid:border-error aria-invalid:border-2";

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body font-medium text-ink">
        {label}
        {optional && (
          <span className="font-normal text-slate-600"> (optional)</span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-small text-slate-600">
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
      {children}
    </div>
  );
}

export function ErrorText({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <p
      id={id}
      className="flex items-start gap-1.5 text-small font-medium text-error"
    >
      <CircleAlert
        aria-hidden="true"
        size={16}
        strokeWidth={2}
        className="mt-0.5 shrink-0"
      />
      <span>
        <span className="sr-only">Error: </span>
        {children}
      </span>
    </p>
  );
}

export function describedBy(id: string, error?: string, hint?: boolean) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

export function ChoiceGroup({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
  error,
  idFor,
}: {
  name: string;
  legend: string;
  hint?: ReactNode;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  idFor: (name: string) => string;
}) {
  const base = idFor(name);
  return (
    <fieldset
      className="flex flex-col gap-3"
      aria-invalid={error ? true : undefined}
      aria-describedby={
        [hint && `${base}-hint`, error && `${base}-error`]
          .filter(Boolean)
          .join(" ") || undefined
      }
    >
      <legend className="mb-1 text-body font-medium text-ink">{legend}</legend>
      {hint && (
        <p id={`${base}-hint`} className="-mt-1 text-small text-slate-600">
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${base}-error`}>{error}</ErrorText>}
      <div className="flex flex-col gap-1">
        {options.map((o, i) => (
          <label
            key={o.value}
            htmlFor={i === 0 ? base : `${base}-${o.value}`}
            className="flex min-h-11 cursor-pointer items-center gap-3 text-body text-ink"
          >
            <input
              id={i === 0 ? base : `${base}-${o.value}`}
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="size-5 shrink-0 accent-indigo"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CheckRow({
  id,
  name,
  value,
  checked,
  onChange,
  invalid,
  describedBy,
  children,
}: {
  id: string;
  name: string;
  value?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  invalid?: boolean;
  describedBy?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-11 items-start gap-3 py-2.5">
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-indigo"
      />
      <label htmlFor={id} className="cursor-pointer text-body text-ink">
        {children}
      </label>
    </div>
  );
}

/** The list of problems shown at the top of a form after a failed submit. */
export function ErrorSummary({
  errors,
  summaryRef,
}: {
  errors: string[][];
  summaryRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={summaryRef}
      tabIndex={-1}
      role="alert"
      className="rounded-s border-2 border-error bg-paper p-4 outline-none sm:p-5"
    >
      <h2 className="font-semibold text-ink">
        {errors.length === 1
          ? "There is one problem to fix"
          : `There are ${errors.length} problems to fix`}
      </h2>
      <ul className="mt-2 flex flex-col gap-1 text-small">
        {errors.map(([href, message]) => (
          <li key={href}>
            <a
              href={href}
              className="font-medium text-error underline underline-offset-4"
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Shown above a form whose sending has not been switched on yet. */
export function NotConnectedNote() {
  return (
    <div
      role="note"
      className="rounded-s bg-marigold-tint p-4 text-small text-ink sm:p-5"
    >
      <p className="font-semibold">This form is not connected yet</p>
      <p>
        You can fill it in, but nothing will be sent until it is switched on. It
        will be soon.
      </p>
    </div>
  );
}
