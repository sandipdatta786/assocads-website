import type { Metadata } from "next";
import { CallToAction } from "@/components/sections/CallToAction";
import { ApproachTeaser } from "@/components/sections/home/ApproachTeaser";
import { AudienceRouting } from "@/components/sections/home/AudienceRouting";
import { Hero } from "@/components/sections/home/Hero";
import { HomeQuestions } from "@/components/sections/home/HomeQuestions";
import { RoadmapTeaser } from "@/components/sections/home/RoadmapTeaser";
import { TrusteesPreview } from "@/components/sections/home/TrusteesPreview";
import { WhatsNext } from "@/components/sections/home/WhatsNext";
import { WhatWeDo } from "@/components/sections/home/WhatWeDo";
import { WhyAssocads } from "@/components/sections/home/WhyAssocads";
import { site } from "@/config/site";

const title = `${site.shortName} | ${site.name}`;
const description =
  "ASSOCADS is a not-for-profit association connecting students, professionals, academia, industry and government to advance AI and Data Science in India.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AudienceRouting />
      <WhatWeDo />
      <ApproachTeaser />
      <WhyAssocads />
      <TrusteesPreview />
      <WhatsNext />
      <RoadmapTeaser />
      <HomeQuestions />
      <CallToAction
        title="Be part of it from the start"
        text="Membership opens once the Board has adopted bye-laws after registration. Tell us you are interested and we will be in touch."
        primary={{ label: "Become a member", href: "/membership" }}
        secondary={{ label: "Partner with us", href: "/partner" }}
      />
    </>
  );
}
