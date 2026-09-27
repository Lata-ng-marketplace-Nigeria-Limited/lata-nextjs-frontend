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

/**
 * Browser Canvas helper to extract a JPEG thumbnail blob from a video File.
 */
export const generateVideoThumbnail = (videoFile: File): Promise<Blob | null> => {
  return new Promise((resolve) => {
    try {
      if (typeof window === "undefined") {
        resolve(null);
        return;
      }
      const video = document.createElement("video");
      const url = URL.createObjectURL(videoFile);
      video.src = url;
      video.currentTime = 0.5;
      video.muted = true;
      video.playsInline = true;

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(url);
              resolve(blob);
            },
            "image/jpeg",
            0.85
          );
        } catch {
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
};

/**
 * Browser Canvas helper to extract a JPEG thumbnail blob from a remote video URL.
 */
export const generateVideoThumbnailFromUrl = (videoUrl: string): Promise<Blob | null> => {
  return new Promise((resolve) => {
    try {
      if (typeof window === "undefined" || !videoUrl) {
        resolve(null);
        return;
      }
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.preload = "metadata";
      video.src = videoUrl;
      video.muted = true;
      video.playsInline = true;

      const timeout = setTimeout(() => {
        resolve(null);
      }, 10000);

      video.onloadedmetadata = () => {
        video.currentTime = 0.5;
      };

      video.onseeked = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.85
          );
        } catch (e) {
          console.error("Canvas export error:", e);
          resolve(null);
        }
      };

      video.onerror = () => {
        clearTimeout(timeout);
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
};
