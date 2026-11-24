import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Placeholder } from "@/components/ui/Callout";
import { Tag } from "@/components/ui/Tag";
import { isPlaceholderValue, placeholderNeed } from "@/config/site";
import type { Trustee } from "@/lib/content/schemas";
import { LinkedInLink } from "./LinkedInLink";

/** Shows a filled-in value, or a visible placeholder while it is missing. */
export function ValueOrPlaceholder({ value }: { value: string }) {
  return isPlaceholderValue(value) ? (
    <Placeholder needed={placeholderNeed(value)} />
  ) : (
    <>{value}</>
  );
}

/** Values that are real, not placeholders. */
export const filled = (values: string[]) =>
  values.filter((v) => v.trim() && !isPlaceholderValue(v));

/**
 * One Founder Trustee or founder member: name, capacity, the office and
 * sub-committees the Board assigned, plus what the person has supplied.
 * Links to their own page only when they have one.
 */
export function TrusteeCard({
  trustee,
  href,
}: {
  trustee: Trustee;
  /** Set only when the trustee has an individual page. */
  href?: string;
}) {
  const photo = trustee.consentToPublish ? trustee.photo : null;
  const expertise = filled(trustee.expertise);
  const linkedin = filled([trustee.linkedin])[0];
  const roleMissing =
    isPlaceholderValue(trustee.role) &&
    isPlaceholderValue(trustee.organisation);

  return (
    <article className="relative flex h-full flex-col gap-5 rounded-l border border-line bg-paper p-5 transition-colors duration-150 has-[a.card-link:hover]:border-indigo sm:p-6">
      {/* The caption sits inside the tile, so every card's name lines up. */}
      <div className="relative">
        <Avatar
          name={trustee.name}
          photo={photo}
          size="fill"
          sizes="(min-width: 1280px) 280px, (min-width: 900px) 30vw, (min-width: 480px) 45vw, 90vw"
          decorative
        />
        {!photo && (
          <p className="absolute inset-x-0 bottom-3 text-center text-caption text-slate-600">
            Photo to be added
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-display text-h3 font-semibold text-ink">
          {href ? (
            <Link
              href={href}
              className="card-link after:absolute after:inset-0 after:rounded-l after:content-[''] hover:underline"
            >
              {trustee.name}
            </Link>
          ) : (
            trustee.name
          )}
        </h2>
        <p className="text-small font-medium text-indigo">{trustee.capacity}</p>
        {trustee.officeTitle && (
          <p className="text-small font-medium text-ink">
            {trustee.officeTitle}
          </p>
        )}
        {trustee.committees.length > 0 && (
          <p className="text-small text-slate-600">
            {trustee.committees.length === 1
              ? "Sub-committee: "
              : "Sub-committees: "}
            {trustee.committees.join(", ")}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 text-body text-slate-600">
        {roleMissing ? (
          <div className="flex flex-wrap gap-2">
            <Placeholder needed={placeholderNeed(trustee.role)} />
            <Placeholder needed={placeholderNeed(trustee.organisation)} />
          </div>
        ) : (
          <p className="font-medium text-ink">
            <ValueOrPlaceholder value={trustee.role} />,{" "}
            <ValueOrPlaceholder value={trustee.organisation} />
          </p>
        )}
        <p>
          <ValueOrPlaceholder value={trustee.bio} />
        </p>
      </div>

      {(expertise.length > 0 || linkedin) && (
        <div className="relative z-10 flex flex-col gap-4">
          {expertise.length > 0 && (
            <ul
              aria-label="Areas of expertise"
              className="flex flex-wrap gap-2"
            >
              {expertise.map((area) => (
                <li key={area}>
                  <Tag variant="neutral">{area}</Tag>
                </li>
              ))}
            </ul>
          )}
          {linkedin && <LinkedInLink href={linkedin} name={trustee.name} />}
        </div>
      )}
    </article>
  );
}
