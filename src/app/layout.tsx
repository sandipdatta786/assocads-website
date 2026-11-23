import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASSOCADS | Association for AI and Data Science",
  description:
    "ASSOCADS is a not-for-profit professional association for AI and Data Science in India, beginning in West Bengal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
