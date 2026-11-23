import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalendarDays, GraduationCap, Landmark, Rocket } from "lucide-react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Callout, Placeholder, StatBlock } from "@/components/ui/Callout";
import { BentoCell, BentoGrid, Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { DotGrid, NodeLines } from "@/components/ui/Decor";
import { Divider, Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Section, type Tone } from "@/components/ui/Section";
import { Badge, Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { Eyebrow, Heading, Lead, Prose } from "@/components/ui/Typography";
import { contrastGrade, contrastRatio } from "@/lib/contrast";

export const metadata: Metadata = pageMetadata({
  title: "Style guide",
  description:
    "Internal reference for the ASSOCADS design system: colours, type, components and approved pairings. Not part of the public site.",
  path: "/styleguide",
  noindex: true,
});

const colours: Array<{ name: string; hex: string; role: string }> = [
  { name: "Ink", hex: "#0B1020", role: "Headings, body text, dark sections" },
  { name: "Paper", hex: "#FFFFFF", role: "Main background" },
  { name: "Cloud", hex: "#F5F6F8", role: "Alternate sections, cards" },
  { name: "Indigo", hex: "#2F3BD9", role: "Buttons, links, logo" },
  { name: "Marigold", hex: "#F2A31B", role: "One highlight per screen" },
  { name: "Indigo Deep", hex: "#232CB0", role: "Hover and pressed" },
  { name: "Indigo Bright", hex: "#8791FF", role: "Links on dark" },
  { name: "Indigo Tint", hex: "#EEF0FF", role: "Soft panels, tags" },
  { name: "Night", hex: "#141A2E", role: "Cards on Ink" },
  { name: "Slate 600", hex: "#4A5165", role: "Secondary text" },
  { name: "Slate 500", hex: "#626A7E", role: "Captions" },
  { name: "Slate 400", hex: "#9AA1B2", role: "Secondary text on dark" },
  { name: "Line", hex: "#D9DCE5", role: "Borders only" },
  { name: "Teal", hex: "#0B7A6E", role: "Second chart colour" },
  { name: "Amber Deep", hex: "#9A5B00", role: "Marigold-family text" },
  { name: "Marigold Tint", hex: "#FFF6E5", role: "Notice banners" },
  { name: "Success", hex: "#157A3E", role: "Form success" },
  { name: "Error", hex: "#C4281C", role: "Form errors" },
];

// Text colour, background colour, label. From the approved table in the brand guide.
const pairings: Array<[string, string, string]> = [
  ["#0B1020", "#FFFFFF", "Ink on Paper"],
  ["#0B1020", "#F5F6F8", "Ink on Cloud"],
  ["#0B1020", "#EEF0FF", "Ink on Indigo Tint"],
  ["#4A5165", "#FFFFFF", "Slate 600 on Paper"],
  ["#4A5165", "#F5F6F8", "Slate 600 on Cloud"],
  ["#626A7E", "#FFFFFF", "Slate 500 on Paper"],
  ["#626A7E", "#F5F6F8", "Slate 500 on Cloud"],
  ["#2F3BD9", "#FFFFFF", "Indigo on Paper"],
  ["#2F3BD9", "#F5F6F8", "Indigo on Cloud"],
  ["#232CB0", "#EEF0FF", "Indigo Deep on Indigo Tint"],
  ["#FFFFFF", "#2F3BD9", "Paper on Indigo"],
  ["#FFFFFF", "#232CB0", "Paper on Indigo Deep"],
  ["#FFFFFF", "#0B1020", "Paper on Ink"],
  ["#FFFFFF", "#141A2E", "Paper on Night"],
  ["#9AA1B2", "#0B1020", "Slate 400 on Ink"],
  ["#9AA1B2", "#141A2E", "Slate 400 on Night"],
  ["#8791FF", "#0B1020", "Indigo Bright on Ink"],
  ["#8791FF", "#141A2E", "Indigo Bright on Night"],
  ["#0B1020", "#8791FF", "Ink on Indigo Bright"],
  ["#F2A31B", "#0B1020", "Marigold on Ink"],
  ["#0B1020", "#F2A31B", "Ink on Marigold"],
  ["#9A5B00", "#FFFFFF", "Amber Deep on Paper"],
  ["#9A5B00", "#FFF6E5", "Amber Deep on Marigold Tint"],
  ["#0B7A6E", "#FFFFFF", "Teal on Paper"],
  ["#157A3E", "#FFFFFF", "Success on Paper"],
  ["#C4281C", "#FFFFFF", "Error on Paper"],
];

const typeScale: Array<{ token: string; className: string; sample: string }> = [
  {
    token: "display-xl",
    className: "font-display text-display-xl font-bold",
    sample: "Connecting talent",
  },
  {
    token: "display-l",
    className: "font-display text-display-l font-bold",
    sample: "Where AI talent meets opportunity",
  },
  {
    token: "h2",
    className: "font-display text-h2 font-semibold",
    sample: "Open to students, professionals, industry and government",
  },
  {
    token: "h3",
    className: "font-display text-h3 font-semibold",
    sample: "Training and certification",
  },
  {
    token: "lead",
    className: "text-lead text-tone-muted",
    sample:
      "A not-for-profit professional association for AI and Data Science in India, beginning in West Bengal.",
  },
  {
    token: "body",
    className: "text-body",
    sample:
      "ASSOCADS brings together students, professionals, academics, industry leaders, entrepreneurs and government bodies.",
  },
  { token: "small", className: "text-small", sample: "Supporting detail text" },
  {
    token: "caption",
    className: "text-caption text-tone-faint font-medium",
    sample: "Photo to be added · Founder Trustee",
  },
  {
    token: "eyebrow",
    className: "text-eyebrow text-tone-faint font-mono font-medium uppercase",
    sample: "Programmes · Kolkata",
  },
];

const tones: Tone[] = ["paper", "cloud", "tint", "ink"];

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Heading level={2}>{title}</Heading>
      {children}
    </div>
  );
}

function ToneDemo({ tone }: { tone: Tone }) {
  return (
    <Section tone={tone} spacing="none" className="rounded-l p-6 sm:p-10">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Eyebrow>Tone: {tone}</Eyebrow>
          <Logo layout="compact" height={28} />
        </div>
        <Heading level={3} size="h2">
          A heading on {tone}
        </Heading>
        <Lead>
          Lead text sits under a heading and introduces the section in one or
          two sentences.
        </Lead>
        <p className="max-w-[34em] text-tone-muted">
          Body text in the muted colour for this tone, with a{" "}
          <a
            href="#buttons"
            className="text-tone-link underline underline-offset-4"
          >
            link inside a sentence
          </a>
          .
        </p>
        <div
          id={tone === "paper" ? "buttons" : undefined}
          className="flex flex-wrap gap-3"
        >
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="marigold">Marigold</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/styleguide" size="large">
            Large link button
          </ButtonLink>
          <TextLink href="/styleguide">Text link with arrow</TextLink>
        </div>
        <Card className="max-w-md">
          <Heading level={4} size="h3">
            Card on {tone}
          </Heading>
          <p className="mt-2 text-tone-muted">
            Cards take the card colour for the surface they sit on.
          </p>
        </Card>
        <Accordion className="max-w-2xl">
          <AccordionItem question="Does the accordion work without JavaScript?">
            Yes. It uses the native details element, so the answer stays in the
            page for search engines and screen readers.
          </AccordionItem>
        </Accordion>
        <Divider />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About", href: "/styleguide" },
            { label: "Governance" },
          ]}
          structuredData={false}
        />
      </div>
    </Section>
  );
}

export default function StyleGuidePage() {
  return (
    <main>
      <Section>
        <Container className="flex flex-col gap-20">
          <header className="flex flex-col gap-5">
            <Logo height={56} />
            <Eyebrow>Internal · not indexed</Eyebrow>
            <Heading level={1}>Style guide</Heading>
            <Lead>
              Every token and component in the ASSOCADS design system. The rules
              behind them are in the brand guide.
            </Lead>
          </header>

          <Block title="Colour">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {colours.map((c) => (
                <li
                  key={c.name}
                  className="min-w-0 overflow-hidden rounded-s border border-line"
                >
                  <div className="h-16" style={{ background: c.hex }} />
                  <div className="p-3">
                    <p className="text-small font-semibold">{c.name}</p>
                    <p className="font-mono text-caption text-slate-600">
                      {c.hex}
                    </p>
                    <p className="text-caption text-slate-500">{c.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Approved text and background pairings">
            <p className="max-w-[34em] text-tone-muted">
              Ratios are calculated on this page to WCAG 2.2. Normal text needs
              4.5 to 1 for AA and 7 to 1 for AAA.
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {pairings.map(([fg, bg, label]) => {
                const ratio = contrastRatio(fg, bg);
                return (
                  <li key={label} className="min-w-0">
                    <div
                      className="rounded-s border border-line p-4"
                      style={{ background: bg, color: fg }}
                    >
                      <p className="font-display text-h3 font-semibold">
                        Data science
                      </p>
                      <p className="font-mono text-caption">
                        {ratio.toFixed(1)} : 1 · {contrastGrade(ratio)}
                      </p>
                    </div>
                    <p className="mt-1.5 text-caption text-slate-600">
                      {label}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Block>

          <Block title="Type scale">
            <dl className="border-t border-line">
              {typeScale.map((t) => (
                <div
                  key={t.token}
                  className="grid grid-cols-1 gap-2 border-b border-line py-4 sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-6"
                >
                  <dt className="font-mono text-caption text-slate-500">
                    {t.token}
                  </dt>
                  <dd className={`${t.className} min-w-0`}>{t.sample}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block title="Logo">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Section
                tone="paper"
                spacing="none"
                className="flex flex-col items-start gap-6 rounded-m border border-line p-8"
              >
                <Logo height={64} />
                <Logo layout="compact" height={40} />
                <Logo layout="symbol" height={48} />
              </Section>
              <Section
                tone="ink"
                spacing="none"
                className="flex flex-col items-start gap-6 rounded-m p-8"
              >
                <Logo height={64} />
                <Logo layout="compact" height={40} />
                <Logo layout="symbol" height={48} />
              </Section>
            </div>
          </Block>

          <Block title="Components on each tone">
            <div className="flex flex-col gap-6">
              {tones.map((tone) => (
                <ToneDemo key={tone} tone={tone} />
              ))}
            </div>
          </Block>

          <Block title="Tags and badges">
            <div className="flex flex-wrap gap-3">
              <Tag>Indigo tag</Tag>
              <Tag variant="marigold">Marigold tag</Tag>
              <Tag variant="neutral">Neutral tag</Tag>
              <Tag variant="outline">Outline tag</Tag>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge status="open" label="Registration open" />
              <Badge status="upcoming" />
              <Badge status="closed" />
              <Badge status="planned" />
            </div>
          </Block>

          <Block title="Bento grid and icons">
            <BentoGrid>
              <BentoCell span={4}>
                <Icon icon={GraduationCap} className="text-indigo" />
                <Heading level={3} className="mt-4">
                  Wide cell
                </Heading>
                <p className="mt-2 text-tone-muted">
                  Spans four of six columns on a desktop.
                </p>
              </BentoCell>
              <BentoCell span={2}>
                <Icon icon={Rocket} className="text-indigo" />
                <Heading level={3} className="mt-4">
                  Narrow cell
                </Heading>
              </BentoCell>
              <BentoCell span={3} raised>
                <Icon icon={Landmark} className="text-indigo" />
                <Heading level={3} className="mt-4">
                  Raised half cell
                </Heading>
              </BentoCell>
              <BentoCell span={3}>
                <Icon icon={CalendarDays} className="text-indigo" />
                <Heading level={3} className="mt-4">
                  Half cell
                </Heading>
              </BentoCell>
            </BentoGrid>
          </Block>

          <Block title="Callouts, placeholders and figures">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Callout title="Note">
                A note gives helpful background without interrupting the page.
              </Callout>
              <Callout variant="status" title="Registration in progress">
                A status callout carries notices that change over time.
              </Callout>
            </div>
            <div className="flex flex-wrap items-end gap-10">
              <Placeholder needed="registered office address" />
              <StatBlock value="13" label="Founder Trustees" />
            </div>
          </Block>

          <Block title="Avatars">
            <div className="flex flex-wrap items-center gap-5">
              <Avatar name="Founder Trustee" size={96} />
              <Avatar name="Sample Name" size={64} />
              <Avatar name="Single" size={44} />
            </div>
            <p className="text-caption text-slate-500">
              Initials are shown until a photograph is supplied with consent.
            </p>
          </Block>

          <Block title="Decorative backgrounds">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Section
                tone="paper"
                spacing="none"
                className="h-56 overflow-hidden rounded-m border border-line"
              >
                <NodeLines />
              </Section>
              <Section
                tone="ink"
                spacing="none"
                className="h-56 overflow-hidden rounded-m"
              >
                <DotGrid />
              </Section>
            </div>
          </Block>

          <Block title="Long-form content">
            <Prose>
              <p>
                Long-form pages such as guides use the reading width and these
                styles. A <a href="#buttons">link</a>, some{" "}
                <strong>bold text</strong> and <code>inline code</code>.
              </p>
              <h3>A sub-heading</h3>
              <ul>
                <li>First point in a list</li>
                <li>Second point in a list</li>
              </ul>
              <blockquote>A quotation or a key statement set apart.</blockquote>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Who it is for</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ordinary Member</td>
                      <td>An individual aged eighteen or over</td>
                    </tr>
                    <tr>
                      <td>Associate Member</td>
                      <td>An institution or organisation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Prose>
          </Block>
        </Container>
      </Section>
    </main>
  );
}
