import { ogImage } from "@/lib/seo/og";

export const alt = "Connecting talent, knowledge, innovation and opportunity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: alt });
}
