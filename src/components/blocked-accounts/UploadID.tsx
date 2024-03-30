"use client";

import React, { useEffect, useState } from "react";
import FormTopLabel from "../input/FormTopLabel";
import { SelectInput } from "../input/SelectInput";
import ImageUploader from "../input/ImageUploader";
import { cn, getFormErrorObject, showToast } from "@/utils";
import { IMakeAppealApiInput, makeAppealApi } from "@/api/blocked-user.client";
import { toast } from "../ui/use-toast";
import Button from "../atom/Button";
import { AppealStatus } from "@/interface/blockedAccounts";

interface Props {
  userId: string;
  appealStatus: AppealStatus | null;
}

const UploadID = (props: Props) => {
  const [file, setFile] = useState<FileList | undefined>(undefined);
  const [idType, setIdType] = useState("" as string);
  const [imageUrl, setImageUrl] = useState("");
  const [idTypeErrorMessage, setIdTypeErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;

    setImageUrl(imageUrl);
  }, [imageUrl, file]);

  const onSubmit = async () => {
    if (!idType) {
      setIdTypeErrorMessage("ID type is required");
      return;
    }
    if (!file) {
      showToast("Please upload a valid Id", "destructive");
      return;
    }
    if (!props.userId) {
      showToast("User Id is required", "destructive");
      return;
    }

    const payload: IMakeAppealApiInput = {
      fileType: idType,
      userId: props.userId,
      file: file?.[0],
    };

    try {
      setLoading(true);
      const response = await makeAppealApi(payload);

      if (!response?.success) {
        showToast(response?.message || "Failed to upload ID", "destructive");
        return;
      }
      toast({
        title: response?.message || "ID uploaded successfully",
        description:
          "Your request will be reviewed by our team in the next few days.",
        variant: "success",
      });
      setIdType("");
      setFile(undefined);
      setImageUrl("");
    } catch (error) {
      const errorRes = getFormErrorObject(error as any);
      console.log(errorRes);
      showToast(
        (error as Error)?.message || "Failed to upload ID",
        "destructive",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12 flex justify-center">
      <div className="w-[36rem] rounded-[0.625rem] border border-grey2 p-6">
        <h1 className="mb-6 text-center text-xl font-semibold xs:text-2xl">
          Upload valid ID
        </h1>
        <FormTopLabel label="ID type" wrapperClass="mb-8">
          <SelectInput
            options={[
              { label: "NIN", value: "NIN" },
              { label: "Driver's License", value: "DRIVERS_LICENSE" },
              {
                label: "International Passport",
                value: "INTERNATIONAL_PASSPORT",
              },
              { label: "Voter's Card", value: "VOTERS_CARD" },
              { label: "Others", value: "OTHER" },
            ]}
            placeholder="Select ID type"
            value={idType}
            setValue={setIdType}
            disabled={props.appealStatus === "PENDING"}
            errorMessage={idTypeErrorMessage}
          />
        </FormTopLabel>
        <div
          className={cn("mb-6 rounded-[0.625rem] border border-grey2 p-6 pb-4")}
        >
          {props.appealStatus === "PENDING" ? (
            <div className="text-center text-lg font-semibold">
              You have already uploaded your ID. Your request is being reviewed
            </div>
          ) : (
            <ImageUploader
              file={file as FileList}
              imageUrl={imageUrl}
              setValue={setFile}
              format="blocked-account"
              profileDescription="Upload ID"
              uploadImgClass="!bg-red-800"
            />
          )}
        </div>
        <div className="flex justify-end">
          <Button
            format="primary"
            onClick={onSubmit}
            disabled={!idType || !file || loading}
          >
            Upload ID
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UploadID;
