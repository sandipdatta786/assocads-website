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
import {
  SectionDots,
  type DotTarget,
} from "@/components/sections/home/SectionDots";
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

/** The homepage's sections, by the id of each heading, for "On this page". */
const sections: DotTarget[] = [
  { id: "about-heading", label: "About" },
  { id: "ecosystem-heading", label: "Communities" },
  { id: "programmes-heading", label: "Areas of work" },
  { id: "approach-heading", label: "Approach" },
  { id: "why-heading", label: `Why ${site.shortName}` },
  { id: "trustees-heading", label: "The people" },
  { id: "roadmap-heading", label: "Roadmap" },
  { id: "latest-heading", label: "Latest updates" },
  { id: "showcase-heading", label: "Showcase an idea" },
  { id: "questions-heading", label: "Good to know" },
];

export default function HomePage() {
  return (
    <>
      <OldAnchorRedirect />
      <SectionDots sections={sections} />
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
