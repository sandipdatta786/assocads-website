import { RelatedLinks } from "@/components/sections/RelatedLinks";
import type { Tone } from "@/components/ui/Section";
import { site } from "@/config/site";

/** Links to the other About pages, taken from the About menu in site settings. */
export function AboutLinks({
  current,
  tone = "paper",
}: {
  /** The path of the page showing this, which is left out. */
  current: string;
  tone?: Tone;
}) {
  const about = site.navigation.find((item) => item.href === "/about");
  const links = (about?.menu ?? []).filter((link) => link.href !== current);

  return (
    <RelatedLinks
      id="more-about"
      eyebrow="About"
      title="More about ASSOCADS"
      links={links}
      tone={tone}
    />
  );
}
