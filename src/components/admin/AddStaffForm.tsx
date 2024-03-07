"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { staffSignUpSchema } from "@/store/schemas/staffSignUpSchema";
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
import { useRouter } from "next/navigation";

interface Props {
  setShowAddStaffModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddStaffForm = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<FileList>();
  const [imageErrorMessage, setImageErrorMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [formState, setFormState] = useState<"one" | "two">("one");
  const { refresh } = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
    setValue,
  } = useForm<z.infer<typeof staffSignUpSchema>>({
    resolver: zodResolver(staffSignUpSchema),
    defaultValues: {
      name: "",
      password: "",
      phoneNumber: "",
      email: "",
      address: "",
      position: "",
      accountName: "",
      accountNumber: "",
      bankName: "",
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

  const onSubmit = async (values: z.infer<typeof staffSignUpSchema>) => {
    if (imageErrorMessage) return;
    if (formState === "one") return;
    const allValues = {
      ...values,
      ...(file?.[0] ? { file: file?.[0] } : {}),
    };
    setLoading(true);
    try {
      const response = await adminOrStaffAddUserApi({
        ...allValues,
        role: "STAFF",
      });

      toast({
        description: `Staff account created successfully`,
        variant: "success",
        duration: 15000,
      });
      refresh?.();
      props.setShowAddStaffModal?.(false);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse<z.infer<typeof staffSignUpSchema>> =
        error;
      const errorObj = getFormErrorObject(errorResponse);

      if (errorObj) {
        setLoading(false);
        if (errorObj.file) setImageErrorMessage(errorObj.file);
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof staffSignUpSchema>, {
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

  const formStyle = cn("flex flex-col gap-y-6");

  return (
    <form className="text-grey9" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="mb-6 text-2xl font-semibold">Add Staff</h1>
      {formState === "one" ? (
        <div>
          <h2 className="mb-6 text-xl font-semibold">Personal Information</h2>
          <h4 className="mb-6 text-sm font-semibold">Add photo</h4>
          <div className={formStyle}>
            <ImageUploader
              format={"profile"}
              name={"profile"}
              file={file}
              disabled={loading}
              setValue={setFile}
              imageUrl={avatar}
              errorMessage={imageErrorMessage}
            />

            <Controller
              render={({ field }) => (
                <FormTopLabel
                  labelClass="font-semibold text-sm"
                  label={"Full name"}
                >
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
                <FormTopLabel
                  labelClass="font-semibold text-sm"
                  label={"Email"}
                >
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
                <FormTopLabel
                  labelClass="font-semibold text-sm"
                  label={"Position"}
                >
                  <TextInput
                    {...field}
                    placeholder="Enter position"
                    disabled={loading}
                    errorMessage={errors.position?.message}
                  />
                </FormTopLabel>
              )}
              name={"position"}
              control={control}
            />

            <Controller
              render={({ field }) => (
                <FormTopLabel
                  labelClass="font-semibold text-sm"
                  label={"Address"}
                >
                  <TextInput
                    {...field}
                    placeholder="Enter location"
                    disabled={loading}
                    errorMessage={errors.address?.message}
                  />
                </FormTopLabel>
              )}
              name={"address"}
              control={control}
            />

            <Controller
              render={({ field }) => (
                <FormTopLabel
                  labelClass="font-semibold text-sm"
                  label={"Password"}
                >
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
                  type={"button"}
                  disabled={loading}
                  format={"primary"}
                  className={"w-full"}
                  onClick={() => setFormState("two")}
                >
                  Continue
                </Button>
              </div>
              <div className={"flex w-full flex-col gap-y-2"}>
                <Button
                  type={"button"}
                  format={"secondary"}
                  className={"w-full"}
                  onClick={() => props.setShowAddStaffModal?.(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="mb-6 text-xl font-semibold">Bank Account Details</h2>
          <div className={formStyle}>
            <Controller
              render={({ field }) => (
                <FormTopLabel
                  labelClass="font-semibold text-sm"
                  label={"Account Name"}
                >
                  <TextInput
                    {...field}
                    placeholder="Enter account name"
                    disabled={loading}
                    errorMessage={errors.accountName?.message}
                  />
                </FormTopLabel>
              )}
              name={"accountName"}
              control={control}
            />
            <Controller
              render={({ field }) => (
                <FormTopLabel
                  labelClass="font-semibold text-sm"
                  label={"Account Number"}
                >
                  <TextInput
                    {...field}
                    placeholder="Enter account number"
                    disabled={loading}
                    errorMessage={errors.accountNumber?.message}
                  />
                </FormTopLabel>
              )}
              name={"accountNumber"}
              control={control}
            />
            <Controller
              render={({ field }) => (
                <FormTopLabel
                  labelClass="font-semibold text-sm"
                  label={"Bank Name"}
                >
                  <TextInput
                    {...field}
                    placeholder="Enter bank name"
                    disabled={loading}
                    errorMessage={errors.bankName?.message}
                  />
                </FormTopLabel>
              )}
              name={"bankName"}
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
                  Create Staff Account
                </Button>

                <Button
                  type={"button"}
                  disabled={loading}
                  format={"secondary"}
                  className={"w-full"}
                  onClick={() => setFormState("one")}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddStaffForm;
