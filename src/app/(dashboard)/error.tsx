"use client";

import Button from "@/components/atom/Button";
import { LANDING_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error for debugging
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Something went wrong!</h2>
        <p className="mb-8 text-gray-600">
          We encountered an unexpected error. Please try refreshing or going back to the home page.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            format="primary"
            onClick={() => {
              startTransition(() => {
                router.refresh();
                reset();
              });
            }}
          >
            Try Again
          </Button>
          <Button format="secondary" as="link" href={LANDING_ROUTE}>
            Go to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}
