"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getEmailImagePresetsApi,
  createEmailImagePresetApi,
  deleteEmailImagePresetApi,
  uploadEmailImagePresetApi,
  IEmailImagePreset,
} from "@/api/admin.client";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Upload, Loader2, Check } from "lucide-react";
import Button from "@/components/atom/Button";

interface PresetImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentSelectedUrl?: string;
}

export default function PresetImagePickerModal({
  isOpen,
  onClose,
  onSelect,
  currentSelectedUrl,
}: PresetImagePickerModalProps) {
  const { toast } = useToast();
  const [presets, setPresets] = useState<IEmailImagePreset[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(currentSelectedUrl || "");

  // Upload fields
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPresets();
      setSelectedUrl(currentSelectedUrl || "");
    }
  }, [isOpen, currentSelectedUrl]);

  const fetchPresets = async () => {
    setLoading(true);
    try {
      const data = await getEmailImagePresetsApi();
      setPresets(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to fetch image presets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAndSave = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!file) {
      toast({
        title: "Validation Error",
        description: "Please select an image file to upload",
        variant: "destructive",
      });
      return;
    }
    if (!label.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a label for this image preset",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload file to R2
      const uploadRes = await uploadEmailImagePresetApi(file);

      // 2. Save preset URL and label to Database
      const newPreset = await createEmailImagePresetApi({
        url: uploadRes.url,
        label: label.trim(),
      });

      // 3. Update local state
      setPresets((prev) => [newPreset, ...prev]);
      setSelectedUrl(newPreset.url);
      setFile(null);
      setLabel("");

      toast({
        title: "Success",
        description: "New image preset uploaded and saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error?.data?.message || "Failed to upload image preset",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation(); // Avoid selecting the item when deleting
    if (!window.confirm("Are you sure you want to delete this preset image?")) {
      return;
    }

    try {
      await deleteEmailImagePresetApi(presetId);
      setPresets((prev) => prev.filter((p) => p.id !== presetId));
      if (presets.find((p) => p.id === presetId)?.url === selectedUrl) {
        setSelectedUrl("");
      }
      toast({
        title: "Success",
        description: "Preset image deleted from library",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to delete preset image",
        variant: "destructive",
      });
    }
  };

  const handleSelectPreset = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col gap-4 rounded-lg bg-white p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Select Preset Image
          </DialogTitle>
        </DialogHeader>

        {/* Upload Container */}
        <div className="flex flex-col items-end gap-3 rounded-lg border border-purp2 bg-purp1 p-4 md:flex-row">
          <div className="flex w-full flex-1 flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">
              Upload New Preset Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full cursor-pointer rounded border border-gray-300 bg-white p-1 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-purp2 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-purp3"
            />
          </div>
          <div className="flex w-full flex-1 flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">
              Image Label
            </span>
            <input
              type="text"
              placeholder="e.g. Summer Promo Banner"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="h-[38px] w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={handleUploadAndSave}
            disabled={isUploading || !file || !label}
            className="flex h-[38px] min-w-[120px] items-center justify-center gap-1 rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload
              </>
            )}
          </button>
        </div>

        {/* Preset Library Grid */}
        <div className="max-h-[400px] min-h-[250px] flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span>Fetching preset library...</span>
            </div>
          ) : presets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <span className="text-lg font-medium">
                No image presets found
              </span>
              <p className="text-sm">Upload one using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-1 sm:grid-cols-3 md:grid-cols-4">
              {presets.map((preset) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedUrl(preset.url)}
                    className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-lg border-2 bg-gray-50 transition ${
                      isSelected
                        ? "border-primary shadow-md"
                        : "border-gray-250 hover:border-gray-400"
                    }`}
                  >
                    <div className="relative flex aspect-square items-center justify-center bg-white">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary bg-opacity-10">
                          <div className="rounded-full bg-primary p-1 text-white">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, preset.id)}
                        className="absolute right-1.5 top-1.5 rounded bg-red-600 p-1 text-white opacity-0 shadow-sm transition hover:bg-red-700 group-hover:opacity-100"
                        title="Delete Preset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="border-t bg-white px-2 py-1.5 text-center">
                      <span className="line-clamp-1 text-xs font-semibold text-gray-800">
                        {preset.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 border-t pt-3">
          <Button format="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            format="primary"
            type="button"
            onClick={handleSelectPreset}
            disabled={!selectedUrl}
          >
            Select Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
