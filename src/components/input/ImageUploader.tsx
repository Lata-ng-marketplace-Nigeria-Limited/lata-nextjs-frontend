"use client";

import { ImagePreview, UploadImageFormat } from "@/interface/image";
import React, { SetStateAction, useEffect, useState } from "react";
import { FileData } from "@/interface/file";
import { cn, convertFileArrayToFileList, isFileSizeGreaterThan } from "@/utils";
import AuthParagraph from "@atom/AuthParagraph";
import UploadImageArea from "@atom/UploadImageArea";
import UploadImg from "@atom/UploadImg";
import { UploadImageIcon } from "@atom/icons/UploadImage";
import Small from "@atom/Small";
import Button from "../atom/Button";

export interface SelectedImagePreview {
  image: ImagePreview;
  fileName: string;
}

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  format: UploadImageFormat;
  profileDescription?: string;
  productTopDescription?: string;
  productBottomDescription?: string[];
  wrapperClass?: string;
  topDescriptionClass?: string;
  bottomDescriptionClass?: string;
  profileDescriptionClass?: string;
  uploadAreaClass?: string;
  uploadImgClass?: string;
  file?: FileList;
  setValue?: React.Dispatch<SetStateAction<FileList | undefined>>;
  errorMessage?: string;
  errorClass?: string;
  imageUrl?: string;
  setSelectedPhotos?: React.Dispatch<
    SetStateAction<SelectedImagePreview | undefined>
  >;
  setHasError?: React.Dispatch<SetStateAction<boolean>>;
  setErrorMessage?: React.Dispatch<SetStateAction<string>>;
  files?: FileData[];
  setDeletedFiles?: React.Dispatch<SetStateAction<string[]>>;
  deletedFiles?: string[];
  selectedPhotos?: SelectedImagePreview | undefined;
}

export default function ImageUploader({
  selectedPhotos,
  deletedFiles,
  setSelectedPhotos,
  setDeletedFiles,
  setHasError,
  file,
  setValue,
  imageUrl,
  setErrorMessage,
  files,
  uploadImgClass,
  uploadAreaClass,
  wrapperClass,
  topDescriptionClass,
  productBottomDescription,
  profileDescription,
  profileDescriptionClass,
  errorMessage,
  productTopDescription,
  bottomDescriptionClass,
  name,
  format,
  onChange,
  errorClass,
  ...props
}: Props) {
  const [selectedPhoto, setSelectedPhoto] = useState<ImagePreview[] | null>();
  const [selected, setSelected] = useState<SelectedImagePreview>();
  const [errorMsg, setErrorMsg] = useState("");
  const [hasSetDefaultImage, setHasSetDefaultImage] = useState(false);

  useEffect(() => {
    // console.log("imageUrl", imageUrl);
    if (hasSetDefaultImage) return;
    if (imageUrl) {
      const fileList = [
        {
          url: imageUrl,
          name: "image",
        },
      ];
      setSelectedPhoto(fileList);
      setHasSetDefaultImage(true);
    }
  }, [hasSetDefaultImage, imageUrl]);

  useEffect(() => {
    if (selectedPhotos) {
      setSelected(selectedPhotos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected) {
      setSelectedPhotos?.(undefined);
    } else {
      setSelectedPhotos?.(selected);
      setErrorMessage?.("");
    }
  }, [selected, setErrorMessage, setSelectedPhotos]);

  useEffect(() => {
    if (!errorMsg) {
      setHasError?.(false);
    } else {
      setHasError?.(true);
    }
  }, [errorMsg, setHasError]);

  useEffect(() => {
    if (!selectedPhoto) return;
    const files = selectedPhoto?.map((data) => data.file);
    const fileList = convertFileArrayToFileList(files);
    setValue?.(fileList);
  }, [selectedPhoto, setValue]);

  const handleFileUpload = async (event: Event) => {
    // @ts-ignore
    onChange?.(event);
    setErrorMsg("");
    setErrorMessage?.("");

    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && (format === "profile" || format === "blocked-account")) {
      const file = files[0];
      const maxFileSize = format === "profile" ? 5 : 10;
      if (isFileSizeGreaterThan(file, maxFileSize)) {
        setErrorMsg("Image size cannot be greater than 5mb");
      }
      const url = URL.createObjectURL(file);
      const fileList: ImagePreview[] = [
        {
          url,
          name: file.name,
          file,
        },
      ];
      setSelectedPhoto((prev) => [...(prev || []), ...fileList]);
      setSelected({
        image: fileList[0],
        fileName: file.name,
      });
    }

    if (files && format === "product") {
      const fileList: ImagePreview[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (isFileSizeGreaterThan(file, 5)) {
          setErrorMsg("Images size cannot be greater than 5mb");
        }
        const url = URL.createObjectURL(file);
        fileList.push({
          url,
          name: file.name,
          file,
        });
      }
      setSelectedPhoto((prev) => [...(prev || []), ...fileList]);
      setSelected({
        image: fileList[0],
        fileName: fileList[0].name,
      });
    }
  };

  return (
    <div className={wrapperClass}>
      {format === "product" ? (
        <AuthParagraph
          className={cn(`sm:text-md mb-3 text-grey7`, topDescriptionClass)}
        >
          {productTopDescription}
        </AuthParagraph>
      ) : null}

      <div
        className={cn(
          `
          flex
          items-center
          gap-x-3
          gap-y-2.5
          sm:flex-col
          sm:items-start
          `,
          {
            "flex-wrap gap-x-[7px] sm:flex-row sm:gap-x-4":
              format === "product",
          },
        )}
      >
        <UploadImageArea
          format={format}
          name={name}
          className={uploadAreaClass}
        >
          {format === "profile" ? (
            <>
              {selectedPhoto ? (
                <UploadImg
                  preview={selectedPhoto[0]}
                  format={format}
                  className={uploadImgClass}
                />
              ) : (
                <UploadImageIcon />
              )}
            </>
          ) : null}

          {format === "blocked-account" ? (
            selectedPhoto ? (
              <div>
                <UploadImg
                  preview={selectedPhoto[0]}
                  format={format}
                  className={cn(uploadImgClass, "mb-3")}
                />

                <div>
                  <p className="text-center font-semibold text-primary ">
                    Choose another file
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-[9rem] w-[10rem] xs:h-[14.6875rem] xs:w-[15.185rem] items-center">
                <p className="m-auto text-center font-semibold text-primary">
                  Click here to upload an image of your valid ID
                </p>
              </div>
            )
          ) : null}

          {format === "product" ? <UploadImageIcon /> : null}
        </UploadImageArea>

        {format === "profile" ? (
          <AuthParagraph
            className={cn(
              `
              max-w-[22ch]
              text-grey8
              sm:max-w-full
              `,
              profileDescriptionClass,
            )}
          >
            {profileDescription}
          </AuthParagraph>
        ) : null}

        {format === "product" ? (
          <>
            {selectedPhoto?.map((photo, i) => (
              <UploadImg
                preview={photo}
                key={i}
                format={format}
                className={uploadImgClass}
                setSelected={setSelected}
                selected={selected}
                isUploaded
                setSelectedPhotos={setSelectedPhoto as any}
                selectedPhotos={selectedPhoto}
              />
            ))}

            {files?.map((file, i) => (
              <UploadImg
                preview={{
                  url: file.url,
                  name: file.meta?.clientName || "",
                }}
                key={i}
                format={format}
                className={uploadImgClass}
                setSelected={setSelected}
                selected={selected}
                isSaved
                setDeletedFiles={setDeletedFiles}
                deletedFiles={deletedFiles}
                file={file}
              />
            ))}
          </>
        ) : null}
      </div>

      <div
        className={cn(`
          mt-3
          flex
          flex-col
          gap-y-1.5
        `)}
      >
        {format === "product" ? (
          <>
            {productBottomDescription?.map((description, i) => (
              <AuthParagraph
                key={i}
                className={cn(
                  `
                  text-[11px]
                  text-grey6
                  sm:text-xs
                `,
                  bottomDescriptionClass,
                )}
              >
                {description}
              </AuthParagraph>
            ))}
          </>
        ) : null}

        <Small
          className={cn(`text-[11px] text-danger sm:text-xs `, errorClass)}
        >
          {errorMessage || errorMsg}
        </Small>
      </div>

      <input
        type={"file"}
        {...props}
        id={name || "upload-image"}
        className={"hidden"}
        name={name || "upload-image"}
        accept={
          "image/jpeg, image/png, image/jpg, image/JPG, image/JPEG, image/PNG"
        }
        multiple={format === "product"}
        onChange={(event) => handleFileUpload(event as any)}
      />
    </div>
  );
}
