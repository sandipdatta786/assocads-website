import { cacheLife } from "next/cache";
import Link from "next/link";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import {
  isPlaceholderValue,
  legalStatusLabel,
  placeholderNeed,
  site,
  socialLinks,
} from "@/config/site";

const networkNames: Record<string, string> = {
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X",
  instagram: "Instagram",
  github: "GitHub",
};

/** The year of the last build, so the copyright line never goes stale for long.
    Cached because Cache Components does not allow reading the clock while prerendering. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

/** A contact detail, or a visible placeholder while it is missing. */
function ContactValue({ value, href }: { value: string; href: string }) {
  if (!value) return null;
  if (isPlaceholderValue(value))
    return <Placeholder needed={placeholderNeed(value)} />;
  return (
    <a
      href={href}
      className="underline-offset-4 hover:text-paper hover:underline"
    >
      {value}
    </a>
  );
}

const linkClass =
  "inline-flex min-h-11 items-center text-small text-slate-400 underline-offset-4 hover:text-paper hover:underline lg:min-h-9";

export function SiteFooter() {
  const office = site.legal.registeredOffice;
  const social = socialLinks();

  return (
    <footer data-tone="ink" className="bg-tone-bg text-tone-fg">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Link href="/" className="inline-flex w-fit rounded-s">
              <Logo layout="horizontal" version="colour-on-dark" height={38} />
            </Link>
            <p className="max-w-sm text-small text-slate-400">
              {site.description}
            </p>

            <div className="flex flex-col gap-2 text-small text-slate-400">
              <h2 className="font-mono text-eyebrow font-medium text-paper uppercase">
                Contact
              </h2>
              <ContactValue
                value={site.contact.email}
                href={`mailto:${site.contact.email}`}
              />
              <ContactValue
                value={site.contact.phone}
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
              />
            </div>

            {social.length > 0 && (
              <ul className="flex flex-wrap gap-x-4">
                {social.map(({ network, url }) => (
                  <li key={network}>
                    <a href={url} rel="me noopener" className={linkClass}>
                      {networkNames[network] ?? network}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8"
          >
            {site.footer.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <h2 className="font-mono text-eyebrow font-medium text-paper uppercase">
                  {group.heading}
                </h2>
                <ul className="flex flex-col">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-tone-line pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
          <h2 className="font-mono text-eyebrow font-medium text-paper uppercase">
            Who we serve
          </h2>
          <ul className="flex flex-wrap gap-x-5">
            {site.audienceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-tone-line pt-6 text-caption text-slate-400">
          <p>{legalStatusLabel()}.</p>
          {office && !isPlaceholderValue(office) && (
            <p>Registered office: {office}</p>
          )}
          <p>
            © <CopyrightYear /> {site.name}.
          </p>
        </div>
      </Container>
    </footer>
  );
}
