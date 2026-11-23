/**
 * /indexnow-key.txt: the IndexNow key file. Search engines that receive an
 * IndexNow submission fetch this file to check the key belongs to this site.
 * The key is public by design, but it is kept out of the repository and comes
 * from the INDEXNOW_KEY environment variable. Without it, the file is absent.
 * See docs/INDEXNOW.md.
 */
export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(key, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
