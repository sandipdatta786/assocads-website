import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { getMembershipCategories } from "@/lib/content/loaders";
import type { MembershipCategory } from "@/lib/content/schemas";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Membership",
  description:
    "The four kinds of ASSOCADS membership in the trust deed: Ordinary, Life, Associate and Honorary. Who can join, how admission works, and what it is not.",
  path: "/membership",
});

/** What a category costs, in words. No figure is ever shown until the Board fixes fees. */
function feeText(category: MembershipCategory): string {
  if (category.slug === "honorary") return "By invitation of the Board";
  if (!category.fee || !site.governance.feesFixed) {
    return "Fee to be fixed by the Board";
  }
  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: category.fee.currency,
    maximumFractionDigits: 0,
  }).format(category.fee.amount);
  return category.fee.period === "annual"
    ? `${amount} a year`
    : category.fee.period === "one-time"
      ? `${amount}, once`
      : "No fee";
}

const takePart = [
  {
    title: "Programmes",
    text: "Training, research, events and the other programmes ASSOCADS plans to run.",
    href: "/programmes",
  },
  {
    title: "Special Interest Groups",
    text: "Groups by industry or domain, which the Board may set up under the trust deed.",
    href: "/communities",
  },
  {
    title: "Events",
    text: "Conferences, seminars, workshops, meetups and hackathons.",
    href: "/events",
  },
  {
    title: "Publications",
    text: "Case studies, reports, white papers and other research.",
    href: "/programmes/research-and-publications",
  },
];

const admissionSteps = [
  {
    title: "Apply",
    text: "Fill in the membership application once applications open. Life Members also need a recommendation from two trustees.",
  },
  {
    title: "Approval",
    text: "The Board of Trustees, or a committee it appoints, considers the application.",
  },
  {
    title: "Pay the fee",
    text: "Once approved, you pay the fee for your category. The Board will fix the fees in the bye-laws after registration.",
  },
];

export default function Page() {
  const categories = getMembershipCategories();

  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Membership"
        lead="The trust deed provides four kinds of membership, for individuals and for organisations. Here is who can join, how admission works, and what membership does and does not mean."
        actions={
          <ButtonLink href={site.joinLink.href} size="large">
            Register your interest
          </ButtonLink>
        }
        breadcrumbs={[{ label: "Membership" }]}
      />

      <Container className="-mt-4 pb-14 lg:-mt-8 lg:pb-20">
        <Callout
          variant="status"
          title="Membership is not open yet"
          className="max-w-3xl"
        >
          <p>
            Membership will open after the trust is registered and the Board has
            adopted its bye-laws. Register your interest now and we will write
            to you when applications open.
          </p>
        </Callout>
      </Container>

      {/* Who can join */}
      <Section
        tone="cloud"
        aria-labelledby="categories-heading"
        id="categories"
      >
        <Container>
          <SectionIntro
            id="categories-heading"
            eyebrow="From the trust deed"
            title="Who can join"
          />
          <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {categories.map((c) => (
              <li
                key={c.slug}
                className="flex flex-col gap-5 rounded-l border border-line bg-paper p-6 sm:p-8"
              >
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-eyebrow font-medium text-slate-600 uppercase">
                    {c.who}
                  </p>
                  <h3 className="font-display text-h3 font-semibold text-ink">
                    {c.name}
                  </h3>
                  <p className="text-body text-slate-600">{c.eligibility}</p>
                </div>
                <ul className="flex flex-col gap-2">
                  {c.terms.map((term) => (
                    <li
                      key={term}
                      className="flex gap-3 text-body text-slate-600"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] size-1.5 shrink-0 rounded-pill bg-indigo"
                      />
                      {term}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto border-t border-line pt-4 text-small font-medium text-ink">
                  {feeText(c)}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* What members can take part in */}
      <Section tone="paper" aria-labelledby="take-part-heading">
        <Container>
          <SectionIntro
            id="take-part-heading"
            title="What members can take part in"
            lead="Under the trust deed, members may take part in these activities, as the Board decides."
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {takePart.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col gap-2 rounded-m border border-line bg-paper p-6 transition-colors duration-150 hover:border-indigo"
                >
                  <span className="flex items-center justify-between gap-3 font-display text-h3 font-semibold text-ink">
                    {item.title}
                    <ArrowRight
                      aria-hidden="true"
                      size={20}
                      strokeWidth={1.5}
                      className="shrink-0 text-indigo transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </span>
                  <span className="text-body text-slate-600">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* What membership is not */}
      <Section tone="ink" aria-labelledby="not-heading">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <p className="font-mono text-eyebrow font-medium text-tone-faint uppercase">
              To be clear
            </p>
            <h2
              id="not-heading"
              className="font-display text-h2 font-semibold text-tone-fg"
            >
              What membership is not
            </h2>
          </div>
          <div className="flex flex-col gap-5 text-body text-slate-400 lg:col-span-7">
            <p>
              Members do not own a share of the trust or its funds. They do not
              manage it, and they do not vote on its affairs, unless bye-laws
              later provide otherwise.
            </p>
            <p>
              This is normal for a public charitable trust. Unlike a society or
              a company, a trust has no shareholders or voting members. It is
              run by its Board of Trustees, who must use its money only for its
              charitable objects.
            </p>
            <p>
              Membership is a way to take part in what ASSOCADS does, not to own
              or control it.{" "}
              <Link
                href="/about/governance"
                className="font-medium text-tone-link underline underline-offset-4"
              >
                How the trust is run
              </Link>
            </p>
          </div>
        </Container>
      </Section>

      {/* How admission works */}
      <Section tone="paper" aria-labelledby="admission-heading">
        <Container>
          <SectionIntro id="admission-heading" title="How admission works" />
          <ol className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
            {admissionSteps.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-3 border-t border-line pt-6"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-eyebrow font-medium text-indigo"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-h3 font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="text-body text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-[68ch] text-small text-slate-600">
            Honorary Members do not apply. The Board admits them by a resolution
            passed by two-thirds of its members.
          </p>
        </Container>
      </Section>

      {/* Comparison: a table on wide screens, stacked cards on phones */}
      <Section tone="cloud" aria-labelledby="compare-heading">
        <Container>
          <SectionIntro
            id="compare-heading"
            title="The four categories side by side"
          />

          <div className="hidden overflow-hidden rounded-l border border-line bg-paper md:block">
            <table className="w-full border-collapse text-left text-small">
              <caption className="sr-only">
                Membership categories compared: who can join, how they are
                admitted, and what they cost
              </caption>
              <thead>
                <tr className="border-b border-line bg-paper">
                  <th scope="col" className="w-1/5 p-5 font-semibold text-ink">
                    Category
                  </th>
                  <th scope="col" className="p-5 font-semibold text-ink">
                    Who can join
                  </th>
                  <th scope="col" className="p-5 font-semibold text-ink">
                    How they are admitted
                  </th>
                  <th scope="col" className="p-5 font-semibold text-ink">
                    What it costs
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr
                    key={c.slug}
                    className="border-b border-line last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="p-5 align-top font-display text-body font-semibold text-ink"
                    >
                      {c.name}
                    </th>
                    <td className="p-5 align-top text-slate-600">
                      {c.eligibility}
                    </td>
                    <td className="p-5 align-top text-slate-600">
                      {c.admission}
                    </td>
                    <td className="p-5 align-top text-slate-600">
                      {c.payment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-4 md:hidden">
            {categories.map((c) => (
              <li
                key={c.slug}
                className="rounded-m border border-line bg-paper p-5"
              >
                <h3 className="font-display text-h3 font-semibold text-ink">
                  {c.name}
                </h3>
                <dl className="mt-4 flex flex-col gap-3 text-small">
                  {[
                    ["Who can join", c.eligibility],
                    ["How they are admitted", c.admission],
                    ["What it costs", c.payment],
                  ].map(([term, detail]) => (
                    <div key={term} className="flex flex-col gap-0.5">
                      <dt className="font-semibold text-ink">{term}</dt>
                      <dd className="text-slate-600">{detail}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Questions
        page="/membership"
        title="Questions about membership"
        tone="paper"
      />

      <CallToAction
        title="Be among the first members"
        text="Membership opens after registration. Register your interest now and we will write to you when applications open."
        secondary={{ label: "Partner with us", href: "/partner" }}
      />
    </>
  );
}
