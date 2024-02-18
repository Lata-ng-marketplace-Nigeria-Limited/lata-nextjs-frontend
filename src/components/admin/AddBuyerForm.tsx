"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { sellerSignUpSchema } from "@/store/schemas/sellerSignUpSchema";
import { z } from "zod";
import {
  cn,
  convertBytesToMB,
  getFormErrorObject,
  isFileSizeGreaterThan,
} from "@/utils";
import { ApiErrorResponse } from "@/interface/general";
import { adminOrStaffAddUserApi } from "@/api/auth.client";
import TextInput from "../input/TextInput";
import Button from "../atom/Button";
import ImageUploader from "../input/ImageUploader";
import { toast } from "../ui/use-toast";
import FormTopLabel from "../input/FormTopLabel";
import { buyerSignUpSchema } from "@/store/schemas/buyerSignUpSchema";

interface Props {
  setShowAddBuyerModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddBuyerForm = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<FileList>();
  const [imageErrorMessage, setImageErrorMessage] = useState("");

  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
  } = useForm<z.infer<typeof sellerSignUpSchema>>({
    resolver: zodResolver(sellerSignUpSchema),
    defaultValues: {
      name: "",
      password: "",
      phoneNumber: "",
      email: "",
      address: "",
      aboutBusiness: "",
    },
  });

  useEffect(() => {
    if (!file?.length) return;
    const uploadedFile = file?.[0]!;
    if (isFileSizeGreaterThan(uploadedFile, 5)) {
      setImageErrorMessage(
        "Image size cannot be greater than 5mb. Current image is " +
          convertBytesToMB(uploadedFile.size) +
          "mb",
      );
    } else {
      setImageErrorMessage("");
    }
  }, [file]);

  const onSubmit = async (values: z.infer<typeof buyerSignUpSchema>) => {
    if (imageErrorMessage) return;
    const allValues = {
      ...values,
      ...(file?.[0] ? { file: file?.[0] } : {}),
    };
    setLoading(true);
    try {
      const response = await adminOrStaffAddUserApi({
        ...allValues,
        role: "BUYER",
      });

      toast({
        description: `Buyer account created successfully`,
        variant: "success",
        duration: 15000,
      });
      console.log("response", response);
      props.setShowAddBuyerModal?.(false);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse<
        z.infer<typeof sellerSignUpSchema>
      > = error;
      const errorObj = getFormErrorObject(errorResponse);

      if (errorObj) {
        setLoading(false);
        if (errorObj.file) setImageErrorMessage(errorObj.file);
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof sellerSignUpSchema>, {
            type: "manual",
            message: value,
          });
        });
        return;
      }

      setLoading(false);
      toast({
        description: `Something went wrong`,
        variant: "destructive",
      });
    }
  };

  return (
    <form className={"flex flex-col gap-y-6"} onSubmit={handleSubmit(onSubmit)}>
      <ImageUploader
        format={"profile"}
        name={"profile"}
        file={file}
        disabled={loading}
        setValue={setFile}
        errorMessage={imageErrorMessage}
        profileDescription={"Add a profile picture for buyer"}
      />

      <Controller
        render={({ field }) => (
          <FormTopLabel labelClass="font-semibold text-sm" label={"Fullname"}>
            <TextInput
              {...field}
              placeholder="Enter Fullname"
              disabled={loading}
              errorMessage={errors.name?.message}
            />
          </FormTopLabel>
        )}
        name={"name"}
        control={control}
      />

      <Controller
        render={({ field }) => (
          <FormTopLabel
            labelClass="font-semibold text-sm"
            label={"Phone number"}
          >
            <TextInput
              {...field}
              placeholder={"Enter Phone number"}
              errorMessage={errors.phoneNumber?.message}
            />
          </FormTopLabel>
        )}
        name={"phoneNumber"}
        control={control}
      />

      <Controller
        render={({ field }) => (
          <FormTopLabel labelClass="font-semibold text-sm" label={"Email"}>
            <TextInput
              {...field}
              placeholder="Enter email"
              type="email"
              disabled={loading}
              errorMessage={errors.email?.message}
            />
          </FormTopLabel>
        )}
        name={"email"}
        control={control}
      />

      <Controller
        render={({ field }) => (
          <FormTopLabel labelClass="font-semibold text-sm" label={"Password"}>
            <TextInput
              {...field}
              placeholder="Enter password"
              type="password"
              isPassword
              disabled={loading}
              name={"field.name"}
              errorMessage={errors.password?.message}
            />
          </FormTopLabel>
        )}
        name={"password"}
        control={control}
      />

      <div className={cn("flex w-full flex-col items-center gap-y-3")}>
        <div className={"flex w-full flex-col gap-y-2"}>
          <Button
            type={"submit"}
            disabled={loading}
            format={"primary"}
            className={"w-full"}
          >
            Create account
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddBuyerForm;
