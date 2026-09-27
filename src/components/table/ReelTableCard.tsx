import { Reel } from "@/api/reels";
import { cn } from "@/utils";
import ReelThumbnail from "@components/reels/ReelThumbnail";

interface Props {
  reel: Reel;
}

export default function ReelTableCard({ reel }: Props) {
  return (
    <div className={cn("flex gap-x-3 items-center")}>
      <div className={cn("w-16 h-16 rounded-md shrink-0 relative overflow-hidden bg-black border border-grey2")}>
        <ReelThumbnail
          videoUrl={reel?.video_url}
          thumbnailUrl={reel?.thumbnail_url}
          title={reel?.title}
        />
      </div>

      <div className="flex flex-col max-w-[300px]">
        <p className="text-sm font-medium text-grey9 truncate">{reel?.title || "No Title"}</p>
        <p className="text-xs text-grey6 line-clamp-2 mt-0.5">{reel?.description || "No description"}</p>
      </div>
    </div>
  );
}
