import Link from "next/link";
import { DismissBanner } from "@/components/layout/DismissBanner";
import { Container } from "@/components/ui/Container";
import { statusBannerText } from "@/config/site";

export const BANNER_STORAGE_KEY = "assocads-status-banner-dismissed";

/**
 * A slim notice under the header, driven only by the legal status helper.
 * It disappears once the trust is registered, and can be dismissed for the
 * browser session. A small inline script in the layout hides it before the
 * first paint when it was dismissed earlier, so it never flashes.
 */
export function StatusBanner() {
  const text = statusBannerText();
  if (!text) return null;

  return (
    <div data-status-banner className="bg-marigold-tint text-ink">
      <Container className="flex min-h-11 items-center justify-between gap-3 py-1.5">
        <p className="text-caption sm:text-small">
          {text}{" "}
          <Link
            href="/about/governance"
            className="font-medium whitespace-nowrap text-amber-deep underline underline-offset-4 hover:text-ink"
          >
            How the trust is run
          </Link>
        </p>
        <DismissBanner storageKey={BANNER_STORAGE_KEY} />
      </Container>
    </div>
  );
}
