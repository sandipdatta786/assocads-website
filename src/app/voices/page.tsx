import type { Metadata } from "next";
import { Mic } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { VoiceCard } from "@/components/voices/VoiceCard";
import { site } from "@/config/site";
import { videoObject } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/metadata";
import { voiceItems } from "@/lib/voices";

export const metadata: Metadata = pageMetadata({
  title: "ASSOCADS Voices: videos and podcasts",
  description:
    "Videos, podcasts, fireside chats and interviews from ASSOCADS with trustees, members, industry leaders and academics in AI and Data Science.",
  path: "/voices",
});

export default async function Page() {
  const items = await voiceItems();

  return (
    <>
      <PageHeader
        eyebrow="Voices"
        title="ASSOCADS Voices"
        lead={`Short videos, podcasts, fireside chats, interviews and conversations from ${site.shortName}, the ${site.name}, with trustees, members, industry leaders and academics. Each recording is listed with the date it was published and the people who take part.${items.length === 0 ? " Nothing has been published yet." : ""}`}
        breadcrumbs={[{ label: "Voices" }]}
      />

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container className="flex flex-col gap-10">
          {items.length > 0 ? (
            <>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {items.map((item) => (
                  <li key={item.key}>
                    <VoiceCard item={item} />
                  </li>
                ))}
              </ul>
              {site.social.youtube && (
                <TextLink href={site.social.youtube}>
                  All videos on our YouTube channel
                </TextLink>
              )}
              <JsonLd items={items.map(videoObject)} />
            </>
          ) : (
            <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-l border border-line bg-cloud p-8 sm:p-10 lg:p-14">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 -z-10 w-1/2 [mask-image:linear-gradient(to_right,transparent,black)] opacity-60"
              >
                <DotGrid />
              </div>
              <Icon icon={Mic} size={32} className="text-indigo" />
              <div className="flex max-w-2xl flex-col gap-4">
                <h2 className="font-display text-h2 font-semibold text-ink">
                  Videos and podcasts will appear here
                </h2>
                <p className="text-body text-slate-600">
                  Nothing has been published yet. We plan to record
                  conversations with trustees, members and people working in AI
                  and Data Science, and to publish them here as they are made.
                </p>
              </div>
              <TextLink href="/insights">News and announcements</TextLink>
            </div>
          )}
        </Container>
      </Section>

      <CallToAction
        title="Have something to share?"
        text="If you would like to take part in a conversation, or suggest a speaker or a topic, tell us."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Events", href: "/events" }}
      />
    </>
  );
}
