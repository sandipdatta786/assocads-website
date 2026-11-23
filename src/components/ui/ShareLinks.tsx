/** Plain share links, with no third-party scripts or tracking. */
export function ShareLinks({
  url,
  title,
  text,
  label,
}: {
  /** The full address of the page being shared. */
  url: string;
  title: string;
  /** The body of the email; the address is added after it. */
  text: string;
  /** Heading above the links, for example "Share this event". */
  label: string;
}) {
  const share = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      label: "X",
      href: `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <p className="text-small font-semibold text-ink">{label}</p>
      <ul className="flex flex-wrap gap-2">
        {share.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target={s.label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-pill border border-ink px-4 text-small font-medium text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
            >
              {s.label}
              {s.label !== "Email" && (
                <span className="sr-only"> (opens in a new tab)</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
