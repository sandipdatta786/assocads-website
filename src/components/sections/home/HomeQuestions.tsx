import { SectionIntro } from "@/components/sections/SectionIntro";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { getFaqs } from "@/lib/content/loaders";

export function HomeQuestions() {
  // The five questions marked for "/" in content/faqs.json.
  const faqs = getFaqs({ page: "/" }).slice(0, 5);

  return (
    <Section tone="cloud" aria-labelledby="questions-heading">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <SectionIntro
            id="questions-heading"
            eyebrow="Questions"
            title="Good to know"
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
