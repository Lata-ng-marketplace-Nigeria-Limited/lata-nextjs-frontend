"use client";

import Button from "@/components/atom/Button";
import { LANDING_ROUTE } from "@/constants/routes";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <h2 className="mb-4 text-center font-bold">Something went wrong!</h2>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Button
            format="primary"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Refresh
          </Button>
          <Button format="secondary" as="link" href={LANDING_ROUTE}>
            Go to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}
