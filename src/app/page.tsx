import type { Metadata } from "next";
import { CallToAction } from "@/components/sections/CallToAction";
import { ApproachTeaser } from "@/components/sections/home/ApproachTeaser";
import { AboutSplit } from "@/components/sections/home/AboutSplit";
import { Ecosystem } from "@/components/sections/home/Ecosystem";
import { Hero } from "@/components/sections/home/Hero";
import { HomeQuestions } from "@/components/sections/home/HomeQuestions";
import { RoadmapTeaser } from "@/components/sections/home/RoadmapTeaser";
import { TrusteesPreview } from "@/components/sections/home/TrusteesPreview";
import { LatestUpdates } from "@/components/sections/home/LatestUpdates";
import { ShowcaseIdea } from "@/components/sections/home/ShowcaseIdea";
import { WhatWeDo } from "@/components/sections/home/WhatWeDo";
import { OldAnchorRedirect } from "@/components/seo/OldAnchorRedirect";
import { WhyAssocads } from "@/components/sections/home/WhyAssocads";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

const title = `${site.shortName} | ${site.name}`;
// The canonical sentence, word for word, as everywhere else.
const description = site.description;

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <OldAnchorRedirect />
      <Hero />
      <AboutSplit />
      <Ecosystem />
      <WhatWeDo />
      <ApproachTeaser />
      <WhyAssocads />
      <TrusteesPreview />
      <RoadmapTeaser />
      <LatestUpdates />
      <ShowcaseIdea />
      <HomeQuestions />
      <CallToAction
        title="The future of AI is a shared responsibility."
        text="Connect with a community committed to advancing AI and Data Science through knowledge, collaboration and responsible innovation."
        primary={{ label: "Become a member", href: "/membership" }}
        secondary={{ label: "Partner with ASSOCADS", href: "/partner" }}
      />
    </>
  );
}
