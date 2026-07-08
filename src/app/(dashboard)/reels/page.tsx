import { Metadata } from "next";
import { getReelsApi } from "@/api/reels";
import { ReelsPagePlayer } from "@/components/reels/ReelsPagePlayer";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export const metadata: Metadata = {
  title: "Lata Reels",
  description: "Watch latest reels from sellers at Lata.",
};

export default async function Page() {
  const reelsData = await getReelsApi();

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-black overflow-hidden flex items-center justify-center relative">
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-white gap-2">
            <Loader className="w-6 h-6 animate-spin text-primary" />
            <span>Loading Reels...</span>
          </div>
        }
      >
        <ReelsPagePlayer reelsGrouped={reelsData?.reels || []} />
      </Suspense>
    </div>
  );
}
