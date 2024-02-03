"use client";

import Button from "@/components/atom/Button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <h2 className="mb-4 text-center font-bold">Something went wrong!</h2>
        <Button
          format="primary"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Please try again
        </Button>
      </div>
    </div>
  );
}
