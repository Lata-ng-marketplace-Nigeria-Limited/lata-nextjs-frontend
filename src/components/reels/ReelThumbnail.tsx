"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Film } from "lucide-react";
import { cn } from "@/utils";

interface Props {
  videoUrl?: string;
  thumbnailUrl?: string | null;
  title?: string;
  className?: string;
  imageClassName?: string;
  fallbackAvatar?: string;
}

export const ReelThumbnail = ({
  videoUrl,
  thumbnailUrl,
  title = "Reel",
  className,
  imageClassName,
  fallbackAvatar,
}: Props) => {
  const [imageError, setImageError] = useState(false);

  const isCloudinary = videoUrl?.includes("cloudinary.com");
  const cloudinaryThumbnail =
    isCloudinary && videoUrl
      ? videoUrl
          .replace("/video/upload/", "/video/upload/so_0/")
          .replace(/\.[^/.]+$/, ".jpg")
      : null;

  const displayImage = thumbnailUrl || cloudinaryThumbnail;

  if (displayImage && !imageError) {
    return (
      <Image
        src={displayImage}
        alt={title}
        fill
        sizes="100px"
        className={cn("object-cover", imageClassName)}
        onError={() => setImageError(true)}
        unoptimized
      />
    );
  }

  if (fallbackAvatar) {
    return (
      <Image
        src={fallbackAvatar}
        alt={title}
        fill
        className={cn("object-cover", imageClassName)}
        unoptimized
      />
    );
  }

  return (
    <div className={cn("w-full h-full flex items-center justify-center bg-slate-900 text-slate-500", className)}>
      <Film className="w-6 h-6" />
    </div>
  );
};

export default ReelThumbnail;
