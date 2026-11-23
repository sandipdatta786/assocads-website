import { Questions } from "@/components/sections/Questions";

/** The five questions marked for "/" in content/faqs.json. */
export function HomeQuestions() {
  return <Questions page="/" title="Good to know" limit={5} />;
}
