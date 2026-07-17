"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Button from "@atom/Button";
import TextInput from "@components/input/TextInput";
import { SelectInput } from "@components/input/SelectInput";
import TextAreaInput from "@components/input/TextAreaInput";
import Modal from "@components/molecule/Modal";
import { useToast } from "@components/ui/use-toast";
import { loanSchema } from "@/store/schemas/loanSchema";
import { createLoanApi } from "@/api/loan.client";
import { cn, getFormErrorObject } from "@/utils";
import { ApiErrorResponse } from "@/interface/general";
import posthog from "posthog-js";

export const RequestLoanForm = () => {
  const [loading, setLoading] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
  } = useForm<z.infer<typeof loanSchema>>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      amount: "",
      duration: "",
      monthlyIncome: "",
      employmentStatus: "",
      purpose: "",
      additionalInfo: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loanSchema>) => {
    setLoading(true);

    try {
      await createLoanApi({
        amount: Number(values.amount),
        purpose: values.purpose,
        duration: Number(values.duration),
        monthlyIncome: Number(values.monthlyIncome),
        employmentStatus: values.employmentStatus,
        additionalInfo: values.additionalInfo || undefined,
      });

      posthog.capture("loan_application_submitted", {
        duration: values.duration,
        employment_status: values.employmentStatus,
      });
      setShowLoanModal(true);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const errorResponse: ApiErrorResponse<z.infer<typeof loanSchema>> = error;
      const errorObj = getFormErrorObject(errorResponse);
      if (errorObj) {
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof loanSchema>, {
            type: "manual",
            message: value,
          });
        });
        return;
      }
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <form
        className="flex max-w-[680px] flex-col gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          <Controller
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="Enter loan amount (₦)"
                label="Requested Loan Amount (₦)"
                name="amount"
                disabled={loading}
                errorMessage={errors?.amount?.message}
              />
            )}
            name="amount"
            control={control}
          />

          <Controller
            render={({ field }) => (
              <SelectInput
                placeholder="Select duration"
                options={[
                  { label: "1 Month", value: "1" },
                  { label: "3 Months", value: "3" },
                  { label: "6 Months", value: "6" },
                  { label: "12 Months", value: "12" },
                  { label: "24 Months", value: "24" },
                ]}
                errorMessage={errors?.duration?.message}
                onValueChange={(val) => field.onChange(val)}
                value={field.value}
                disabled={loading}
              />
            )}
            name="duration"
            control={control}
          />
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          <Controller
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="Enter monthly income (₦)"
                label="Monthly Income (₦)"
                name="monthlyIncome"
                disabled={loading}
                errorMessage={errors?.monthlyIncome?.message}
              />
            )}
            name="monthlyIncome"
            control={control}
          />

          <Controller
            render={({ field }) => (
              <SelectInput
                placeholder="Employment status"
                options={[
                  { label: "Employed", value: "Employed" },
                  { label: "Self-Employed", value: "Self-Employed" },
                  { label: "Unemployed", value: "Unemployed" },
                ]}
                errorMessage={errors?.employmentStatus?.message}
                onValueChange={(val) => field.onChange(val)}
                value={field.value}
                disabled={loading}
              />
            )}
            name="employmentStatus"
            control={control}
          />
        </div>

        <Controller
          render={({ field }) => (
            <TextAreaInput
              {...field}
              placeholder="What do you plan to use this loan for?"
              label="Purpose of Loan"
              name="purpose"
              disabled={loading}
              wrapperClass={"w-full"}
              errorMessage={errors?.purpose?.message}
              inputClass={"py-[1.6rem]"}

              // rows={4}
            />
          )}
          name="purpose"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <TextAreaInput
              {...field}
              wrapperClass={"w-full"}
              placeholder="Any additional information (Optional)"
              label="Additional Info"
              name="additionalInfo"
              disabled={loading}
              inputClass={"py-[1.6rem]"}
              errorMessage={errors?.additionalInfo?.message}
              // rows={3}
            />
          )}
          name="additionalInfo"
          control={control}
        />

        <Button
          format="primary"
          className="mt-2 w-full rounded-lg py-3 text-sm font-semibold sm:max-w-[200px]"
          disabled={loading}
          type="submit"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>

      <Modal
        isShown={showLoanModal}
        setIsShown={setShowLoanModal}
        preventOverlayClose
      >
        <div className="mx-auto max-w-[360px] rounded-xl bg-white p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-bold text-grey10">
            Not Eligible Yet
          </h3>
          <p className="mb-6 text-xs leading-relaxed text-grey6">
            You are not qualified for a loan yet. Please maintain active shop
            operations, subscriptions, and transaction history to become
            eligible.
            <span className="mt-2 block font-bold text-primary">
              COMING SOON!!!
            </span>
          </p>
          <Button
            format="primary"
            className="w-full rounded-lg py-2 text-sm font-semibold"
            onClick={() => {
              setShowLoanModal(false);
              router.push("/balance");
            }}
          >
            Okay
          </Button>
        </div>
      </Modal>
    </>
  );
};
