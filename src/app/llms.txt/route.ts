import { builtAt } from "@/lib/clock";
import { llmsTxt } from "@/lib/llms";

/** /llms.txt, built with the site from its configuration and content. */
export async function GET() {
  return new Response(llmsTxt(await builtAt()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
