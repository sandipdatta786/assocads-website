import { ExternalLink } from "lucide-react";

/** A trustee's LinkedIn profile. The label names the person for screen readers. */
export function LinkedInLink({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on LinkedIn (opens in a new tab)`}
      className="inline-flex min-h-11 items-center gap-1.5 self-start font-medium text-indigo underline-offset-4 hover:underline"
    >
      LinkedIn
      <ExternalLink aria-hidden="true" size={16} strokeWidth={1.5} />
    </a>
  );
}
