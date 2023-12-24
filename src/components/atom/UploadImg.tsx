import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { ImagePreview, UploadImageFormat } from "@/interface/image";
import { SelectedImagePreview } from "@components/input/ImageUploader";
import { FileData } from "@/interface/file";
import { cn } from "@/utils";
import Button from "@atom/Button";
import { CircleCancelIcon } from "@atom/icons/CircleCancel";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import { IMAGE_BLUR_URL } from "@/constants/others";

interface Props
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "placeholder"> {
  preview: ImagePreview;
  format: UploadImageFormat;
  selected?: SelectedImagePreview | undefined;
  setSelected?: React.Dispatch<
    SetStateAction<SelectedImagePreview | undefined>
  >;
  isSaved?: boolean;
  setSelectedPhotos?: React.Dispatch<SetStateAction<ImagePreview[] | null>>;
  selectedPhotos?: ImagePreview[] | null;
  file?: FileData;
  setDeletedFiles?: React.Dispatch<SetStateAction<string[]>>;
  deletedFiles?: string[];
  isUploaded?: boolean;
}

export default function UploadImg({
  preview,
  format,
  selected,
  setSelected,
  isSaved,
  setSelectedPhotos,
  selectedPhotos,
  file,
  setDeletedFiles,
  deletedFiles,
  isUploaded,
  ...props
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const isSm = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    if (!file?.id) return;
    if (deletedFiles?.includes(file?.id)) {
      setIsDeleted(true);
    } else {
      setIsDeleted(false);
    }
  }, [deletedFiles, file?.id]);

  const handleSetSelected = () => {
    setSelected?.({
      image: preview,
      fileName: file ? file.id : preview.name,
    });
  };
  const handleDeleteOverlayClick = (e: any) => {
    const elm = e.target as HTMLElement;
    if (
      elm &&
      buttonRef &&
      (buttonRef.current?.contains(elm) || buttonRef.current === elm)
    ) {
      return;
    }
    handleSetSelected();
  };

  const handleImgClick = () => {
    if (isDeleted) {
      setDeletedFiles?.((prev) => {
        const fileId = file?.id;
        if (!prev || !fileId) {
          return prev;
        }
        return prev.filter((id) => id !== fileId);
      });
      return;
    }
    handleSetSelected();
  };

  const handleDeleteClick = () => {
    if (selected && selected?.image?.url === preview.url) {
      setSelected?.(undefined);
    }

    if (isUploaded) {
      const newSelectedPhotos = selectedPhotos?.filter(
        (photo) => photo.url !== preview.url,
      );
      setSelectedPhotos?.(newSelectedPhotos || null);
      return;
    }

    setDeletedFiles?.((prev) => {
      const fileId = file?.id;
      if (!fileId) {
        return prev;
      }
      if (!prev || prev.includes(fileId)) {
        return prev;
      }
      return [...prev, fileId];
    });

    if (selected && selected?.image?.url === preview.url) {
      setSelected?.(undefined);
    }
  };

  return (
    <div
      className={cn("relative group  ", {
        "opacity-20": isDeleted,
        "w-full h-full": format === "profile",
      })}
    >
      <div
        className={cn(
          `
            absolute
            top-0
            left-0
            w-full
            h-full
            py-[5px]
            px-[4px]
            hidden
            
            
            before:transition-opacity
            before:duration-300
            before:ease-in
            
            
            justify-end
            items-start
            
            before:bg-black
            before:opacity-40
            before:absolute
            before:top-0
            before:left-0
            before:w-full
            before:h-full
            before:rounded-[7px]
            
        `,
          {
            "group-hover:flex": (isSaved && !isDeleted) || isUploaded,
          },
        )}
        onClick={handleDeleteOverlayClick}
      >
        <Button
          aria-label={"Delete this image"}
          format={"icon"}
          className={" after:hidden"}
          onClick={handleDeleteClick}
          ref={buttonRef as any}
        >
          <CircleCancelIcon />
        </Button>
      </div>

      <Image
        {...props}
        src={preview.url}
        alt={preview.name}
        title={preview.name}
        layout="fill"
        width={format === "profile" ? 0 : isSm ? 130 : 70}
        height={format === "profile" ? 0 : isSm ? 120 : 61}
        style={{
          width: format === "profile" ? "100%" : isSm ? 130 : 70,
          height: format === "profile" ? "100%" : isSm ? 120 : 61,
        }}
        aria-label={"You are trying to upload this file named: " + preview.name}
        className={cn(
          `
        w-full 
        h-full 
        
        rounded-full
        cursor-pointer
        
       `,
          {
            [`
            max-w-[70px] 
            max-h-[61px] 
            sm:max-w-[130px] 
            sm:max-h-[120px]
            rounded-[7px]
          `]: format === "product",

            [`
            object-cover
          `]: format === "profile",
            [`
            outline
            outline-primary
            outline-[3px]
            border-white
            border-[1px]
          `]: selected?.image?.url === preview.url,
          },
          props.className,
        )}
        onClick={handleImgClick}
        placeholder={"blur"}
        blurDataURL={IMAGE_BLUR_URL}
      />
    </div>
  );
}
