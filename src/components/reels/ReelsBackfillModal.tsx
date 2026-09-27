"use client";

import React, { useState } from "react";
import Modal from "@molecule/Modal";
import Button from "@atom/Button";
import { getReelsApi, Reel } from "@/api/reels";
import { uploadReelThumbnailApi } from "@/api/reels.client";
import { generateVideoThumbnailFromUrl } from "@/utils/reels";
import { useToast } from "@components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReelsBackfillModal = ({ isOpen, onClose }: Props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev.slice(0, 49)]);
  };

  const startBackfill = async () => {
    setIsRunning(true);
    setCompleted(false);
    setLogs([]);
    addLog("Fetching reels list from server...");

    try {
      const res = await getReelsApi();
      const allReels: Reel[] = res?.reels ? res.reels.flatMap((g) => g.reels) : [];
      
      const candidateReels = allReels.filter(
        (r) => !r.thumbnail_url && r.video_url && !r.video_url.includes("cloudinary.com")
      );

      setProgress({ current: 0, total: candidateReels.length });

      if (candidateReels.length === 0) {
        addLog("No legacy R2 reels missing thumbnails found! All up to date.");
        setIsRunning(false);
        setCompleted(true);
        return;
      }

      addLog(`Found ${candidateReels.length} legacy R2 reels to backfill.`);

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < candidateReels.length; i++) {
        const reel = candidateReels[i];
        setProgress({ current: i + 1, total: candidateReels.length });
        addLog(`[${i + 1}/${candidateReels.length}] Extracting frame for: "${reel.title || "Untitled"}"...`);

        try {
          const thumbnailBlob = await generateVideoThumbnailFromUrl(reel.video_url);
          if (!thumbnailBlob) {
            throw new Error("Failed to capture video frame");
          }

          addLog(`Uploading thumbnail to R2 for: "${reel.title || "Untitled"}"...`);
          await uploadReelThumbnailApi(reel.id, thumbnailBlob);
          successCount++;
          addLog(`✅ Successfully backfilled reel: "${reel.title || "Untitled"}"`);
        } catch (err: any) {
          failCount++;
          addLog(`❌ Failed reel "${reel.title}": ${err?.message || "Error"}`);
        }
      }

      addLog(`Finished! Successfully generated ${successCount} thumbnails (${failCount} errors).`);
      toast({
        title: "Backfill Complete",
        description: `Successfully processed ${successCount} reel thumbnails.`,
        variant: "success",
      });
      setCompleted(true);
      router.refresh();
    } catch (err: any) {
      addLog(`Fatal Error: ${err?.message || "Failed to fetch reels"}`);
      toast({
        title: "Backfill Error",
        description: err?.message || "Could not fetch reels",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Modal isShown={isOpen} setIsShown={onClose}>
      <div className="flex flex-col gap-y-4 p-2 max-w-[550px] w-full">
        <div className="flex items-center gap-x-3 border-b border-grey2 pb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-grey9">Backfill R2 Reel Thumbnails</h3>
            <p className="text-xs text-grey6">
              Generate and upload JPEG poster thumbnails for legacy Cloudflare R2 reels using browser canvas.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {progress.total > 0 && (
          <div className="flex flex-col gap-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-grey8">
              <span>Progress</span>
              <span>
                {progress.current} / {progress.total} (
                {Math.round((progress.current / progress.total) * 100)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-grey2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Logs Console */}
        <div className="w-full h-48 bg-slate-950 rounded-lg p-3 overflow-y-auto font-mono text-xs text-slate-300 flex flex-col-reverse gap-y-1 border border-slate-800">
          {logs.length === 0 ? (
            <span className="text-slate-500 italic">Click "Start Backfill" to begin...</span>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="leading-snug">
                {log}
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-x-3 pt-2">
          <Button format="secondary" onClick={onClose} disabled={isRunning}>
            {completed ? "Done" : "Cancel"}
          </Button>
          {!completed && (
            <Button format="primary" onClick={startBackfill} disabled={isRunning}>
              {isRunning ? (
                <div className="flex items-center gap-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Start Backfill"
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReelsBackfillModal;
