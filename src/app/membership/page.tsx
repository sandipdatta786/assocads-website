import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { getMembership } from "@/lib/content/loaders";
import type { MembershipFee } from "@/lib/content/schemas";
import { feeNote, feeText } from "@/lib/membership";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { plainPage } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: "Membership",
  description:
    "ASSOCADS membership for students, academics, professionals and organisations: categories, annual fees, tenure, concessions and how to join.",
  path: "/membership",
});

type Row = { key: string; cells: ReactNode[] };

/**
 * A table on wide screens and a card for each row on phones, so nothing
 * scrolls sideways. The first cell names the row.
 */
function DataTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: Row[];
}) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-l border border-line bg-paper md:block">
        <table className="w-full border-collapse text-left text-small">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line">
              {head.map((h) => (
                <th key={h} scope="col" className="p-4 font-semibold text-ink">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className="border-b border-line last:border-b-0"
              >
                {row.cells.map((cell, i) =>
                  i === 0 ? (
                    <th
                      key={i}
                      scope="row"
                      className="p-4 align-top font-display text-body font-semibold text-ink"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="p-4 align-top text-slate-600">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-4 md:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li
            key={row.key}
            className="rounded-m border border-line bg-paper p-5"
          >
            <p className="font-display text-body font-semibold text-ink">
              {row.cells[0]}
            </p>
            <dl className="mt-3 flex flex-col gap-3 text-small">
              {row.cells.slice(1).map((cell, i) => (
                <div key={head[i + 1]} className="flex flex-col gap-0.5">
                  <dt className="font-semibold text-ink">{head[i + 1]}</dt>
                  <dd className="text-slate-600">{cell}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

/** A fee, with its concession or condition below it. */
function Fee({ fee }: { fee: MembershipFee }) {
  const note = feeNote(fee);
  return (
    <>
      <span className="font-medium text-ink">{feeText(fee)}</span>
      {note && <span className="block">{note}</span>}
    </>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 max-w-[40em] text-small text-slate-600">{children}</p>
  );
}

export default function Page() {
  const m = getMembership();

  return (
    <>
      <JsonLd
        items={[
          plainPage({
            path: "/membership",
            name: "Membership",
            description: String(metadata.description),
            dateModified: site.updated.membership,
          }),
        ]}
      />
      <PageHeader
        eyebrow="Membership"
        title="Membership"
        updated={site.updated.membership}
        lead={`Membership of ${site.shortName}, the ${site.name}, is for individuals and organisations: students, academics, professionals, independents, institutions, startups, companies and public bodies. The Board approved these categories and fees in ${m.approved}. Membership opens after the trust is registered.`}
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
          title="Membership opens after registration"
          className="max-w-3xl"
        >
          <p>
            The categories and fees on this page are approved, but no fee is
            collected yet. Register your interest and we will write to you when
            applications open. Benefits begin as each programme starts.
          </p>
        </Callout>
      </Container>

      <Section tone="cloud" aria-labelledby="structure-heading" id="structure">
        <Container>
          <SectionIntro
            id="structure-heading"
            title="How membership is organised"
            lead="Each member is either an individual or an organisation, and belongs to one of six verticals."
          />
          <DataTable
            caption="The six verticals, with the individual and organisational category in each"
            head={["Vertical", "Individual", "Organisation"]}
            rows={m.structure.map((s) => ({
              key: s.vertical,
              cells: [
                s.vertical,
                s.individual ?? "Not applicable",
                s.organisation,
              ],
            }))}
          />
        </Container>
      </Section>

      <Section
        tone="paper"
        aria-labelledby="categories-heading"
        id="categories"
      >
        <Container>
          <SectionIntro
            id="categories-heading"
            eyebrow="For individuals"
            title="Individual membership"
            lead={m.feeTerms}
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {m.individual.map((c) => {
              const note = feeNote(c.fee);
              return (
                <li
                  key={c.slug}
                  id={c.slug}
                  className="flex scroll-mt-24 flex-col gap-4 rounded-l border border-line bg-paper p-6"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-h3 font-semibold text-ink">
                      {c.name}
                    </h3>
                    <p className="text-small text-slate-600">{c.eligibility}</p>
                  </div>
                  <p className="flex flex-col gap-0.5">
                    <span className="font-display text-h3 font-semibold text-indigo">
                      {feeText(c.fee)}
                    </span>
                    {note && (
                      <span className="text-small text-slate-600">{note}</span>
                    )}
                  </p>
                  <p className="mt-auto border-t border-line pt-4 text-small text-slate-600">
                    <span className="font-medium text-ink">Includes: </span>
                    {c.benefits}
                  </p>
                </li>
              );
            })}
          </ul>
          <Note>{m.individualNote}</Note>
        </Container>
      </Section>

      <Section
        tone="cloud"
        aria-labelledby="organisations-heading"
        id="organisations"
      >
        <Container>
          <SectionIntro
            id="organisations-heading"
            eyebrow="For organisations"
            title="Organisational membership"
            lead={`${m.feeTerms} Each membership includes seats for the people the organisation names.`}
          />
          <DataTable
            caption="Organisational membership: band, annual fee, seats included and benefits"
            head={[
              "Category",
              "Band",
              "Annual fee",
              "Seats included",
              "Includes",
            ]}
            rows={m.organisation.flatMap((c) =>
              c.bands.map((b) => ({
                key: `${c.slug}-${b.band}`,
                cells: [
                  c.name,
                  b.band,
                  <Fee key="fee" fee={b.fee} />,
                  b.seats,
                  b.benefits,
                ],
              })),
            )}
          />
          <Note>{m.organisationNote}</Note>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="tenure-heading" id="tenure">
        <Container>
          <SectionIntro
            id="tenure-heading"
            title="How long you can join for"
            lead="Join for one year, or for longer at a lower price."
          />
          <DataTable
            caption="Membership tenure: duration, price and extras"
            head={["Tenure", "Duration", "Price", "Extras"]}
            rows={m.tenures.map((t) => ({
              key: t.name,
              cells: [t.name, t.duration, t.price, t.extras],
            }))}
          />
          <Note>{m.tenureNote}</Note>
        </Container>
      </Section>

      <Section
        tone="tint"
        aria-labelledby="concessions-heading"
        id="concessions"
      >
        <Container>
          <SectionIntro
            id="concessions-heading"
            title="Concessions"
            lead="Ways to pay less, so that cost does not keep anyone out."
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {m.concessions.map((c) => (
              <li
                key={c.name}
                className="flex flex-col gap-2 rounded-m bg-tone-card p-6"
              >
                <h3 className="font-display text-h3 font-semibold text-ink">
                  {c.name}
                </h3>
                <p className="text-body text-slate-600">{c.details}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

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
            <p>{m.basis}</p>
            <p>
              This is normal for a public charitable trust. Unlike a society or
              a company, a trust has no shareholders or voting members. It is
              run by its Board of Trustees, who must use its money only for its
              charitable objects.
            </p>
            <p>
              Membership is a way to take part in what {site.shortName} does,
              not to own or control it.{" "}
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

      <Section tone="paper" aria-labelledby="honorary-heading" id="honorary">
        <Container>
          <SectionIntro
            id="honorary-heading"
            title="Honorary recognition"
            lead={m.honoraryNote}
          />
          <DataTable
            caption="Honorary recognition: how each tier is granted, its fee and its recognition"
            head={["Tier", "How it is granted", "Fee", "Recognition"]}
            rows={m.honorary.map((h) => ({
              key: h.name,
              cells: [h.name, h.granted, h.fee, h.recognition],
            }))}
          />
          <h3
            id="rights-heading"
            className="mt-14 mb-6 font-display text-h3 font-semibold text-ink"
          >
            Rights by kind of membership
          </h3>
          <DataTable
            caption="Rights by kind of membership"
            head={["Right", ...m.rights.columns]}
            rows={m.rights.rows.map((r) => ({
              key: r.right,
              cells: [r.right, ...r.values],
            }))}
          />
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="rules-heading" id="rules">
        <Container>
          <SectionIntro
            id="rules-heading"
            title="Joining and membership rules"
          />
          <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {m.rules.map((rule, i) => (
              <li
                key={rule.title}
                className="flex flex-col gap-3 border-t border-line pt-6"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-eyebrow font-medium text-indigo"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-h3 font-semibold text-ink">
                  {rule.title}
                </h3>
                <p className="text-body text-slate-600">{rule.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Questions
        page="/membership"
        title="Questions about membership"
        tone="paper"
      />

      <CallToAction
        title="Be among the first members"
        text="Membership opens after registration. Register your interest now and we will write to you when applications open. The first 500 individuals and 25 organisations get 30% off."
        secondary={{ label: "Partner with us", href: "/partner" }}
      />
    </>
  );
}
