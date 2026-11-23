import { ogImage } from "@/lib/seo/og";

export const alt = "Frequently asked questions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: alt, eyebrow: "Questions" });
}
