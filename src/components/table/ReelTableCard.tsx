import { Reel } from "@/api/reels";
import { cn } from "@/utils";
import Image from "next/image";

interface Props {
  reel: Reel;
}

export default function ReelTableCard({ reel }: Props) {
  const getThumbnailUrl = (videoUrl: string) => {
    if (videoUrl.includes("cloudinary.com")) {
      return videoUrl
        .replace("/video/upload/", "/video/upload/so_0/")
        .replace(/\.[^/.]+$/, ".jpg");
    }
    return "/images/video-placeholder.jpg";
  };

  return (
    <div className={cn("flex gap-x-3 items-center")}>
      <div className={cn("w-16 h-16 rounded-md shrink-0 relative overflow-hidden bg-black border border-grey2")}>
        <Image
          className="object-cover w-full h-full rounded-md"
          fill
          sizes="64px"
          src={getThumbnailUrl(reel.video_url)}
          alt={reel.title}
          unoptimized
        />
      </div>

      <div className="flex flex-col max-w-[300px]">
        <p className="text-sm font-medium text-grey9 truncate">{reel.title}</p>
        <p className="text-xs text-grey6 line-clamp-2 mt-0.5">{reel.description || "No description"}</p>
      </div>
    </div>
  );
}
