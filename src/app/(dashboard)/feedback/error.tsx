"use client";

import Button from "@/components/atom/Button";
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
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 font-bold text-xl">Something went wrong!</h2>
        <Button
          format="primary"
          onClick={() => {
            startTransition(() => {
              router.refresh();
              reset();
            });
          }}
        >
          Please try again
        </Button>
      </div>
    </div>
  );
}
