"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { updateTarget } from "@/api/target.client";
import TextInput from "../input/TextInput";
import Button from "../atom/Button";
import { StaffCategoryTypes, TargetLevelTypes } from "./EditTarget";
import { createTargetSchema } from "./targetSchema";

interface EditTargetFormProps {
  targetLevel: TargetLevelTypes;
  email: string;
  staffCategory: StaffCategoryTypes;
  selectedDate: string;
  selectedMonth: string;
}

const EditTargetForm = (props: EditTargetFormProps) => {
  const [loading, setLoading] = useState(false);

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
      toast({
        title: "Amount and Salary are required",
        variant: "destructive",
      });
      return;
    }

    if (
      typeof Number(values.amount) !== "number" ||
      typeof Number(values.salary) !== "number"
    ) {
      toast({
        title: "Amount and Salary must be numbers",
        variant: "destructive",
      });
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
      toast({
        title: "Target updated successfully",
        variant: "success",
      });
      reset();
    } catch (error: any) {
      toast({
        title: error?.data?.message || "Error updating target",
        variant: "destructive",
      });
      console.log("errorArray", error?.data);
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
      <h2 className="mb-1 font-bold">Target {props.targetLevel}</h2>
      <h3 className="mb-6 font-medium italic text-grey7">{display()}</h3>
      <Controller
        control={control}
        name="amount"
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Amount"
            label="Amount"
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
            wrapperClass={"w-full mb-4"}
            errorMessage={errors.salary?.message}
          />
        )}
      />
      <div className="flex items-center gap-3">
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
