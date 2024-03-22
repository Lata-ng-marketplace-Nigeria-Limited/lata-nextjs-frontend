"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { cn, getFormErrorObject } from "@/utils";
import { ApiErrorResponse } from "@/interface/general";
import { adminOrStaffAddUserApi } from "@/api/auth.client";
import TextInput from "../input/TextInput";
import Button from "../atom/Button";
import { toast } from "../ui/use-toast";
import FormTopLabel from "../input/FormTopLabel";
import { buyerSignUpSchema } from "@/store/schemas/buyerSignUpSchema";
import TableTopArea from "./TableTopArea";
import ResizableDialog from "./ResizableDialog";

interface Props {}

const AddBuyerForm = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [showAddBuyerModal, setShowAddBuyerModal] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
  } = useForm<z.infer<typeof buyerSignUpSchema>>({
    resolver: zodResolver(buyerSignUpSchema),
    defaultValues: {
      name: "",
      password: "",
      phoneNumber: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof buyerSignUpSchema>) => {
    const allValues = {
      ...values,
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
      setShowAddBuyerModal(false);
    } catch (error: any) {
      const errorResponse: ApiErrorResponse<z.infer<typeof buyerSignUpSchema>> =
        error;
      const errorObj = getFormErrorObject(errorResponse);

      if (errorObj) {
        setLoading(false);
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof buyerSignUpSchema>, {
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

  const handleAddBuyer = () => {
    setShowAddBuyerModal(!showAddBuyerModal);
  };

  return (
    <>
      <TableTopArea
        title="All Buyers"
        buttonText="+ Add Buyer"
        placeholder="Search buyers"
        onClick={handleAddBuyer}
      />

      <ResizableDialog
        isShown={showAddBuyerModal}
        setIsShown={setShowAddBuyerModal}
      >
        <form
          className={"flex flex-col gap-y-6"}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            render={({ field }) => (
              <FormTopLabel
                labelClass="font-semibold text-sm"
                label={"Fullname"}
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
                type={"submit"}
                disabled={loading}
                format={"primary"}
                className={"w-full"}
              >
                Create account
              </Button>
            </div>
            <div className={"flex w-full flex-col gap-y-2"}>
              <Button
                type={"button"}
                format={"secondary"}
                className={"w-full"}
                onClick={() => setShowAddBuyerModal?.(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </ResizableDialog>
    </>
  );
};

export default AddBuyerForm;
