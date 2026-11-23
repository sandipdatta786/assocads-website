import { SectionIntro } from "@/components/sections/SectionIntro";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Section, type Tone } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { getFaqs } from "@/lib/content/loaders";

/** The questions from content/faqs.json that list this page in their "pages". */
export function Questions({
  page,
  title = "Questions",
  eyebrow = "Questions",
  limit,
  tone = "cloud",
}: {
  /** The page's path, for example "/about/governance". */
  page: string;
  title?: string;
  eyebrow?: string;
  limit?: number;
  tone?: Tone;
}) {
  const faqs = getFaqs({ page }).slice(0, limit);
  if (faqs.length === 0) return null;

  return (
    <Section tone={tone} aria-labelledby="questions-heading">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <SectionIntro
            id="questions-heading"
            eyebrow={eyebrow}
            title={title}
            action={<TextLink href="/faq">All questions</TextLink>}
            stacked
          />
        </div>
        <Accordion className="lg:col-span-8">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} question={faq.question}>
              <p>{faq.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
