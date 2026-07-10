"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createReelApi } from "@/api/reels.client";
import { useToast } from "@components/ui/use-toast";
import TextInput from "@components/input/TextInput";
import TextAreaInput from "@components/input/TextAreaInput";
import Button from "@atom/Button";
import { UploadCloud, Play, FileVideo, AlertCircle, Trash2, Video, PlusCircle } from "lucide-react";
import { cn } from "@/utils";

export const ReelUploadForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Handle file drop/selection
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid video file.",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 60 * 1024 * 1024; // 60MB max
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Video size must be less than 60MB.",
        variant: "destructive",
      });
      return;
    }

    setVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoPreview(objectUrl);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!videoFile) {
      toast({
        title: "Validation Error",
        description: "Please select a video file.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await createReelApi({
        title: title.trim(),
        description: description.trim(),
        file: videoFile,
      });

      toast({
        title: "Reel Created",
        description: "Your reel was submitted successfully and is pending admin approval.",
        variant: "success",
      });

      router.push("/shop?tab=reels");
      router.refresh();
    } catch (error: any) {
      const errMsg = error?.data || error?.message || "Something went wrong. Please try again.";
      toast({
        title: "Failed to upload reel",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto bg-white border border-grey2 rounded-xl p-5 md:p-8 shadow-sm">
      <div className="border-b border-grey2 pb-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-grey10">Create Reel</h1>
        <p className="text-sm text-grey6 mt-1">
          Share your moments with the world
        </p>
        <p className="text-xs text-grey5 mt-1 leading-normal">
          Uploads require admin review before appearing in the public feed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Left Column: Video Select & Preview */}
        <div className="flex-1 flex flex-col gap-4">
          <label className="text-xs font-semibold text-grey8 uppercase tracking-wider">
            Video Selection
          </label>

          {!videoPreview ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "h-[320px] md:h-[450px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 p-6 text-center cursor-pointer transition-all duration-200 select-none",
                dragActive
                  ? "border-primary bg-purp2 text-primary"
                  : "border-primary/60 hover:border-primary bg-purp1/20 hover:bg-purp1/40 text-primary"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <Video className="w-16 h-16 text-primary stroke-[1.2] mb-1" />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-base text-primary">
                  Select Video
                </span>
                <span className="text-xs text-grey6">
                  Tap to choose a video file
                </span>
                <span className="text-[10px] text-grey5 mt-1 font-medium">
                  MP4, MOV, or WEBM (Max size 60MB)
                </span>
              </div>
            </div>
          ) : (
            <div className="relative h-[320px] md:h-[450px] rounded-xl overflow-hidden bg-black border border-grey2 group shadow-inner">
              <video src={videoPreview} className="w-full h-full object-contain" controls />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all shadow-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {videoFile && (
            <div className="flex items-center gap-2 text-xs text-grey6 bg-grey1 p-2.5 rounded-lg border border-grey2">
              <FileVideo className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate flex-1">{videoFile.name}</span>
              <span className="font-semibold shrink-0">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Title, Description, and Create Reel Button */}
        <div className="w-full md:w-[360px] flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-semibold text-grey8 block mb-2">
                Title
              </label>
              <TextInput
                value={title}
                setValue={setTitle}
                placeholder="Enter a catchy title"
                wrapperClass="w-full"
                inputClass="h-11 border-grey3 focus:border-primary text-sm rounded-lg"
              />
              <p className="text-[11px] text-grey6 mt-1.5">
                Maximum 80 characters.
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-grey8 block mb-2">
                Description <span className="text-xs text-grey5 font-normal">(Optional)</span>
              </label>
              <TextAreaInput
                value={description}
                setValue={setDescription}
                placeholder="Tell us about your reel"
                inputClass="h-[120px] border-grey3 focus:border-primary text-sm rounded-lg py-2.5"
              />
            </div>

            <div className="flex items-start gap-2 bg-yellow-50 text-yellow-800 border border-yellow-200 p-3 rounded-lg text-xs leading-normal">
              <AlertCircle className="w-4 h-4 shrink-0 text-yellow-600 mt-0.5" />
              <span>
                Reels must be approved by an administrator before they become visible to other buyers on the platform.
              </span>
            </div>
          </div>

          <div className="mt-8 md:mt-0">
            <Button
              type="submit"
              format="primary"
              disabled={loading || !title.trim() || !videoFile}
              className="w-full py-3 text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                "Uploading Reel..."
              ) : (
                <>
                  <PlusCircle className="w-4.5 h-4.5 stroke-[2]" />
                  Create Reel
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
