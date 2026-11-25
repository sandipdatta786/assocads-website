import { builtAt } from "@/lib/clock";
import { searchIndex } from "@/lib/search";

/**
 * /search-index.json: every published page and content item, for the site
 * search (src/components/search/SiteSearch.tsx). Built with the site, like
 * /feed.xml, and fetched only when someone first opens search.
 */
export async function GET() {
  return Response.json(searchIndex(await builtAt()), {
    headers: { "X-Robots-Tag": "noindex" },
  });
}
