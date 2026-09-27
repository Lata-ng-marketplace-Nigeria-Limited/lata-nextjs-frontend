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
 * Uses fetch -> local Blob URL to ensure CORS-safe non-tainted canvas extraction.
 */
export const generateVideoThumbnailFromUrl = async (
  videoUrl: string
): Promise<Blob | null> => {
  if (typeof window === "undefined" || !videoUrl) return null;

  let localObjectURL: string | null = null;
  try {
    // 1. Fetch video as a local blob to guarantee same-origin canvas safety
    try {
      const res = await fetch(videoUrl);
      if (res.ok) {
        const blob = await res.blob();
        localObjectURL = URL.createObjectURL(blob);
      }
    } catch (fetchErr) {
      console.warn("Direct fetch for video failed, falling back to direct URL", fetchErr);
    }

    const targetUrl = localObjectURL || videoUrl;

    return await new Promise<Blob | null>((resolve) => {
      const video = document.createElement("video");
      if (!localObjectURL) {
        video.crossOrigin = "anonymous";
      }
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = targetUrl;

      let hasResolved = false;

      const cleanup = () => {
        if (localObjectURL) {
          URL.revokeObjectURL(localObjectURL);
        }
      };

      const finish = (result: Blob | null) => {
        if (!hasResolved) {
          hasResolved = true;
          clearTimeout(timeout);
          cleanup();
          resolve(result);
        }
      };

      const timeout = setTimeout(() => {
        console.warn("Video thumbnail extraction timed out for:", videoUrl);
        finish(null);
      }, 20000);

      const captureFrame = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              finish(blob);
            },
            "image/jpeg",
            0.85
          );
        } catch (err) {
          console.error("Canvas draw error for video:", videoUrl, err);
          finish(null);
        }
      };

      let seekTimer: ReturnType<typeof setTimeout> | null = null;

      video.onloadeddata = () => {
        try {
          const targetTime = Math.min(0.5, (video.duration || 1) / 2);
          video.currentTime = isNaN(targetTime) || targetTime <= 0 ? 0.1 : targetTime;
          seekTimer = setTimeout(() => {
            captureFrame();
          }, 1500);
        } catch {
          captureFrame();
        }
      };

      video.onseeked = () => {
        if (seekTimer) clearTimeout(seekTimer);
        captureFrame();
      };

      video.onerror = (e) => {
        console.error("Video element error loading video:", videoUrl, e);
        finish(null);
      };

      video.load();
    });
  } catch (err) {
    console.error("generateVideoThumbnailFromUrl error:", err);
    if (localObjectURL) {
      URL.revokeObjectURL(localObjectURL);
    }
    return null;
  }
};
