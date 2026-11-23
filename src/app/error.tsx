"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageHeader
      eyebrow="Something went wrong"
      title="This page could not be shown"
      lead="Something went wrong while loading this page. Please try again. If it keeps happening, let us know through the contact page."
      actions={
        <>
          <Button size="large" onClick={() => retry()}>
            Try again
          </Button>
          <ButtonLink href="/contact" size="large" variant="secondary">
            Contact us
          </ButtonLink>
        </>
      }
    />
  );
}
