"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { updateTarget } from "@/api/kpi.client";
import TextInput from "../input/TextInput";
import Button from "../atom/Button";
import { createTargetSchema } from "./targetSchema";
import { StaffCategoryTypes, TargetLevelTypes } from "./EditKPI";
import { ApiErrorResponse } from "@/interface/general";
import { getFormErrorObject } from "@/utils";

interface EditTargetFormProps {
  targetLevel: TargetLevelTypes;
  email: string;
  staffCategory: StaffCategoryTypes;
  selectedDate: string;
  selectedMonth: string;
  setShowFields: React.Dispatch<React.SetStateAction<boolean>>;
  setStaffCategory: React.Dispatch<
    React.SetStateAction<StaffCategoryTypes | "">
  >;
}

const EditTargetForm = (props: EditTargetFormProps) => {
  const [loading, setLoading] = useState(false);
  const showToast = (message: string, variant: "destructive" | "success") => {
    toast({
      title: message,
      variant,
    });
  };

  const {
    control,
    formState: { errors },
    watch,
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(createTargetSchema),
    defaultValues: {
      amount: "",
      salary: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createTargetSchema>) => {
    if (!values.amount || !values.salary) {
      showToast("Amount and Salary are required", "destructive");
      return;
    }

    if (
      typeof Number(values.amount) !== "number" ||
      typeof Number(values.salary) !== "number"
    ) {
      showToast("Amount and Salary must be numbers", "destructive");
      return;
    }

    const payload = {
      amount: Number(values.amount),
      salary: Number(values.salary),
      level: props.targetLevel,
      email: props.email,
      staffCategory: props.staffCategory,
      selectedDate: props.selectedDate,
    };
    try {
      setLoading(true);
      await updateTarget(payload);
      showToast("Target updated successfully", "success");
      reset();
    } catch (error: any) {
      const errorResponse: ApiErrorResponse<
        z.infer<typeof createTargetSchema>
      > = error;
      const errorObj = getFormErrorObject(errorResponse);

      const isEmailDoesNotExist = errorObj?.email?.includes("exists");

      if (isEmailDoesNotExist) {
        showToast("This email does not exist", "destructive");
        return;
      }
      showToast(error?.data?.message || "Error updating target", "destructive");
    } finally {
      setLoading(false);
    }
  };

  const display = () => {
    if (props.staffCategory === "all") {
      return "This update will affect all staffs";
    }

    if (props.staffCategory === "single") {
      return "This update will affect only the selected staff";
    }

    if (props.staffCategory === "older") {
      return `This update will affect all staffs with accounts older than ${
        props.selectedMonth
      } ${Number(props.selectedMonth) === 1 ? "month" : "months"}`;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="mb-1 font-medium">Target {props.targetLevel}</h2>
      <h3 className="mb-6 text-xs font-normal italic text-grey7">
        {display()}
      </h3>
      <Controller
        control={control}
        name="amount"
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Amount"
            label="Amount"
            inputClass="!min-h-12"
            value={field.value}
            wrapperClass={"w-full mb-4"}
            errorMessage={errors.amount?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="salary"
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Salary"
            label="Salary"
            value={field.value}
            inputClass="!min-h-12"
            wrapperClass={"w-full mb-4"}
            errorMessage={errors.salary?.message}
          />
        )}
      />
      <div className="flex items-center gap-3">
        <Button
          format="secondary"
          type="button"
          onClick={() => {
            props.setStaffCategory("");
            props.setShowFields(false);
          }}
        >
          Close
        </Button>
        <Button format="secondary" type="button" onClick={() => reset()}>
          Reset
        </Button>
        <Button
          format="primary"
          type="submit"
          disabled={loading || !watch("amount") || !watch("salary")}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditTargetForm;
