"use client";

import Button from "@/components/atom/Button";
import { LANDING_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  const { push } = useRouter();

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <h2 className="mb-4 text-center font-bold">Something went wrong!</h2>
        <div className="flex items-center gap-6 flex-wrap">
          <Button
            format="primary"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Refresh
          </Button>
          <Button format="secondary" onClick={() => push(LANDING_ROUTE)}>
            Go to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}
