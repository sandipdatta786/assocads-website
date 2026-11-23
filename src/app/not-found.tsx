import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const helpful = [
  { label: "About ASSOCADS", href: "/about" },
  { label: "Programmes", href: "/programmes" },
  { label: "Membership", href: "/membership" },
  { label: "Questions", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="Error 404"
        title="We could not find that page"
        lead="The address may be mistyped, or the page may have moved. These links may help."
        actions={
          <ButtonLink href="/" size="large">
            Go to the home page
          </ButtonLink>
        }
      />
      <Container className="pb-24">
        <ul className="flex flex-col gap-1">
          {helpful.map((link) => (
            <li key={link.href}>
              <TextLink href={link.href}>{link.label}</TextLink>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
