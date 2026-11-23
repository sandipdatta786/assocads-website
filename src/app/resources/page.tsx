import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Download, FileText, Library } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import {
  KIT,
  appIcons,
  brandColours,
  colourVersions,
  logoLayouts,
  typefaces,
} from "@/lib/brandKit";
import { cn } from "@/lib/cn";
import { builtAt } from "@/lib/clock";
import { getDocuments, getGlossary, getGuides } from "@/lib/content/loaders";
import { themeDescriptions, themeLabels, themeOrder } from "@/lib/guides";
import { formatLongDate } from "@/lib/publishing";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Resources: guides, glossary and brand kit",
  description:
    "ASSOCADS guides on careers, Kolkata and AI policy, a glossary of AI and Data Science terms, official documents and the logo files and brand guide.",
  path: "/resources",
});

const downloadLink =
  "inline-flex min-h-11 items-center gap-1.5 rounded-pill border border-line px-3 text-caption font-medium text-ink transition-colors duration-150 hover:border-indigo hover:text-indigo";

/** Light previews sit on Cloud; dark and white versions on Ink or Indigo. */
const previewBg: Record<string, string> = {
  colour: "bg-cloud",
  "colour-on-dark": "bg-ink",
  indigo: "bg-cloud",
  black: "bg-cloud",
  white: "bg-indigo",
};

export default async function Page() {
  const guides = getGuides({ now: await builtAt() });
  const terms = getGlossary();
  const documents = getDocuments();

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Resources"
        lead={`Guides, the glossary, official documents and the ${site.shortName} brand kit, in one place.`}
        breadcrumbs={[{ label: "Resources" }]}
      />

      {/* Guides */}
      <Section tone="cloud" aria-labelledby="guides-heading">
        <Container>
          <SectionIntro
            id="guides-heading"
            eyebrow="Read"
            title="Guides"
            lead="Sourced guides, each reviewed by a named trustee before it is published."
            action={<TextLink href="/guides">All guides</TextLink>}
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {themeOrder.map((theme) => {
              const count = guides.filter((g) => g.theme === theme).length;
              return (
                <li key={theme}>
                  <Link
                    href={count > 0 ? `/guides#${theme}` : "/guides"}
                    className="group flex h-full flex-col gap-3 rounded-l border border-line bg-paper p-6 transition-colors duration-150 hover:border-indigo"
                  >
                    <Icon icon={BookOpen} size={24} className="text-indigo" />
                    <span className="font-display text-h3 font-semibold text-ink group-hover:text-indigo">
                      {themeLabels[theme]}
                    </span>
                    <span className="text-body text-slate-600">
                      {themeDescriptions[theme]}
                    </span>
                    <span className="mt-auto pt-2 text-small font-medium text-ink">
                      {count === 0
                        ? "In preparation"
                        : count === 1
                          ? "1 guide"
                          : `${count} guides`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* Glossary */}
      <Section tone="paper" aria-labelledby="glossary-heading">
        <Container className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <Icon icon={Library} size={32} className="text-indigo" />
            <h2
              id="glossary-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Glossary
            </h2>
            <p className="text-body text-slate-600">
              Plain-English definitions of terms in AI and Data Science, each
              with an example, why it matters and sources.
            </p>
            <div>
              <TextLink href="/glossary">
                {terms.length > 0
                  ? `Browse ${terms.length} terms`
                  : "Open the glossary"}
              </TextLink>
            </div>
          </div>
          {terms.length > 0 && (
            <ul className="flex flex-wrap gap-2 lg:col-span-7">
              {terms.slice(0, 12).map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/glossary/${t.slug}`}
                    className="inline-flex min-h-11 items-center rounded-pill border border-line bg-paper px-4 text-small font-medium text-ink transition-colors duration-150 hover:border-indigo hover:text-indigo"
                  >
                    {t.term}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {/* Documents */}
      <Section tone="cloud" aria-labelledby="documents-heading">
        <Container>
          <SectionIntro
            id="documents-heading"
            eyebrow="Official"
            title="Documents"
            lead="Governance documents and reports are published here as they are adopted."
          />
          <ul className="flex flex-col divide-y divide-line rounded-l border border-line bg-paper">
            {documents.map((d) => (
              <li
                key={d.file}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
              >
                <Icon
                  icon={FileText}
                  size={24}
                  className={cn(
                    "shrink-0",
                    d.available ? "text-indigo" : "text-slate-500",
                  )}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="font-display text-body font-semibold text-ink">
                    {d.title}
                  </p>
                  <p className="text-small text-slate-600">{d.description}</p>
                </div>
                {d.available && d.date ? (
                  <a href={d.file} download className={downloadLink}>
                    <Download aria-hidden="true" size={16} strokeWidth={1.5} />
                    Download PDF
                    <span className="sr-only">
                      : {d.title}, {formatLongDate(d.date)}
                    </span>
                  </a>
                ) : (
                  <Badge
                    status="planned"
                    label="To be published"
                    className="w-fit shrink-0"
                  />
                )}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Brand kit */}
      <Section
        tone="paper"
        id="brand-kit"
        aria-labelledby="brand-heading"
        className="scroll-mt-20"
      >
        <Container>
          <SectionIntro
            id="brand-heading"
            eyebrow="For press and partners"
            title="Brand kit"
            lead={`The ${site.shortName} logo in every layout and colour, the colours and typefaces, and the full brand guide.`}
          />
          <div className="flex flex-col gap-14">
            <Callout variant="status" title="The logo is not yet final">
              <p>
                The logo is awaiting adoption by the Board of Trustees and has
                not yet been checked against registered trademarks. Please do
                not use it on anything printed or permanent until this notice is
                removed.
              </p>
            </Callout>

            {/* Logos */}
            <div className="flex flex-col gap-6">
              <h3 className="font-display text-h3 font-semibold text-ink">
                Logo files
              </h3>
              <p className="max-w-[68ch] text-body text-slate-600">
                SVG files scale to any size and suit the web and print. PNG
                files have a transparent background. Keep clear space equal to
                the height of the letter A on every side, and never stretch,
                recolour or redraw the logo.
              </p>
              <ul className="grid gap-6 lg:grid-cols-2">
                {logoLayouts.map((layout) => (
                  <li
                    key={layout.key}
                    className="flex flex-col gap-5 rounded-l border border-line p-5 sm:p-6"
                  >
                    <div className="flex h-36 items-center justify-center rounded-m bg-cloud p-6">
                      {/* eslint-disable-next-line @next/next/no-img-element -- the master SVG is shown as it is, unprocessed */}
                      <img
                        src={`${KIT}/svg/${layout.prefix}-colour.svg`}
                        alt={`${site.shortName} logo, ${layout.label.toLowerCase()} layout, colour version`}
                        className="max-h-full max-w-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-display text-body font-semibold text-ink">
                        {layout.label}
                      </h4>
                      <p className="text-small text-slate-600">{layout.use}</p>
                    </div>
                    <table className="w-full text-small">
                      <caption className="sr-only">
                        Downloads for the {layout.label.toLowerCase()} layout
                      </caption>
                      <tbody className="divide-y divide-line border-y border-line">
                        {layout.versions.map((v) => {
                          const version = colourVersions.find(
                            (c) => c.key === v,
                          )!;
                          const file = `${layout.prefix}-${v}`;
                          return (
                            <tr key={v}>
                              <th
                                scope="row"
                                className="py-2 pr-3 text-left font-medium text-ink"
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    aria-hidden="true"
                                    className={cn(
                                      "size-4 shrink-0 rounded-pill border border-line",
                                      previewBg[v],
                                    )}
                                  />
                                  {version.label}
                                </span>
                              </th>
                              <td className="py-2 text-right">
                                <span className="inline-flex flex-wrap justify-end gap-2">
                                  <a
                                    href={`${KIT}/svg/${file}.svg`}
                                    download
                                    className={downloadLink}
                                  >
                                    SVG
                                    <span className="sr-only">
                                      , {layout.label}, {version.label}
                                    </span>
                                  </a>
                                  <a
                                    href={`${KIT}/png/${file}.png`}
                                    download
                                    className={downloadLink}
                                  >
                                    PNG
                                    <span className="sr-only">
                                      , {layout.label}, {version.label}
                                    </span>
                                  </a>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4 rounded-l border border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex flex-col gap-1">
                  <h4 className="font-display text-body font-semibold text-ink">
                    App icon
                  </h4>
                  <p className="text-small text-slate-600">
                    For social media profile pictures and app tiles.
                  </p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {appIcons.map((icon) =>
                    (["svg", "png"] as const).map((ext) => (
                      <li key={`${icon.file}-${ext}`}>
                        <a
                          href={`${KIT}/${ext}/${icon.file}.${ext}`}
                          download
                          className={downloadLink}
                        >
                          {icon.label}, {ext.toUpperCase()}
                        </a>
                      </li>
                    )),
                  )}
                </ul>
              </div>
            </div>

            {/* Colours and type */}
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                <h3 className="font-display text-h3 font-semibold text-ink">
                  Colours
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {brandColours.map((c) => (
                    <li
                      key={c.name}
                      className="flex gap-4 rounded-m border border-line p-4"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-12 shrink-0 rounded-s border border-line",
                          c.swatch,
                        )}
                      />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-small font-semibold text-ink">
                          {c.name}
                        </span>
                        <span className="font-mono text-caption text-slate-600">
                          {c.hex}
                        </span>
                        <span className="text-caption text-slate-600">
                          {c.role}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <h3 className="font-display text-h3 font-semibold text-ink">
                  Typefaces
                </h3>
                <ul className="flex flex-col divide-y divide-line border-y border-line">
                  {typefaces.map((t) => (
                    <li key={t.name} className="flex flex-col gap-1 py-4">
                      <span className={cn("text-h3 text-ink", t.className)}>
                        {t.name}
                      </span>
                      <span className="text-small text-slate-600">{t.use}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-small text-slate-600">
                  All three are free under the SIL Open Font Licence and are
                  available from Google Fonts.
                </p>
              </div>
            </div>

            {/* Guide */}
            <div className="flex flex-col gap-4 rounded-l bg-indigo-tint p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-h3 font-semibold text-ink">
                  The full brand guide
                </h3>
                <p className="text-body text-slate-600">
                  Colours with contrast ratios, typography, logo rules and the
                  voice, in one document.
                </p>
              </div>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <a
                    href={`${KIT}/assocads-brand-guide.md`}
                    download
                    className={cn(downloadLink, "bg-paper")}
                  >
                    <Download aria-hidden="true" size={16} strokeWidth={1.5} />
                    Brand guide (Markdown)
                  </a>
                </li>
                <li>
                  <a
                    href={`${KIT}/assocads-logo-sheet.png`}
                    download
                    className={cn(downloadLink, "bg-paper")}
                  >
                    <Download aria-hidden="true" size={16} strokeWidth={1.5} />
                    Logo sheet (PNG)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
