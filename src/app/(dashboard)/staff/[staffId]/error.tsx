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
  const { back, refresh } = useRouter();
  useEffect(() => {
    console.error(error);
    console.log(error?.message);
  }, [error]);

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <h2 className="mb-4 text-center font-bold">Something went wrong!</h2>
        <div className="flex gap-2">
          <Button format="primary" onClick={() => back()}>
            Go back
          </Button>
          <Button
            format="secondary"
            onClick={() => {
              startTransition(() => {
                refresh();
                reset();
              });
            }}
          >
            Please try again
          </Button>
        </div>
      </div>
    </div>
  );
}
