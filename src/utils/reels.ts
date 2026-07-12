/**
 * Cloudinary helper to get first frame poster image for a video.
 */
export const getThumbnailUrl = (videoUrl: string): string => {
  if (!videoUrl) return "/images/video-placeholder.jpg";
  if (videoUrl.includes("cloudinary.com")) {
    return videoUrl
      .replace("/video/upload/", "/video/upload/so_0/")
      .replace(/\.[^/.]+$/, ".jpg");
  }
  return "/images/video-placeholder.jpg";
};

/**
 * Cloudinary helper to get compressed, auto-formatted optimized video url.
 */
export const getOptimizedVideoUrl = (videoUrl: string): string => {
  if (!videoUrl) return "";
  if (videoUrl.includes("cloudinary.com") && videoUrl.includes("/video/upload/")) {
    return videoUrl.replace("/video/upload/", "/video/upload/q_auto,f_auto/");
  }
  return videoUrl;
};
