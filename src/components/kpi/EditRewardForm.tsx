"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import TextInput from "../input/TextInput";
import Button from "../atom/Button";
import { StaffCategoryTypes } from "./EditKPI";
import { isNumberSchema } from "@/store/schemas/phoneNumberSchema";
import { StaffRewardTypes } from "./EditReward";
import { SelectInput } from "../input/SelectInput";
import { updateRewardApi } from "@/api/kpi.client";

interface EditRewardFormProps {
  email: string;
  staffCategory: StaffCategoryTypes;
  selectedDate: string;
  selectedMonth: string;
  query: StaffRewardTypes;
  setShowFields: React.Dispatch<React.SetStateAction<boolean>>;
  setStaffCategory: React.Dispatch<
    React.SetStateAction<StaffCategoryTypes | "">
  >;
}

const EditRewardForm = (props: EditRewardFormProps) => {
  const [loading, setLoading] = useState(false);

  const showToast = (message: string, variant: "destructive" | "success") => {
    toast({
      title: message,
      variant,
    });
  };

  const editRewardSchema = z.object({
    bonusAmount: z
      .string()
      .nullable()
      .and(isNumberSchema("Please enter a valid number")),
    commissionPercentage: z
      .string()
      .nullable()
      .and(isNumberSchema("Please enter a valid number")),
  });

  const {
    control,
    formState: { errors },
    watch,
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(editRewardSchema),
    defaultValues: {
      bonusAmount: "",
      commissionPercentage: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof editRewardSchema>) => {
    if (props.query === "bonus" || !props.query) {
      if (!values.bonusAmount) {
        showToast("Bonus amount is required", "destructive");
        return;
      }
      if (isNaN(Number(values.bonusAmount))) {
        showToast("Please enter a valid number", "destructive");
        return;
      }
    }

    if (props.query === "commission") {
      if (!values.commissionPercentage) {
        showToast("Commission is required", "destructive");
        return;
      }
      if (isNaN(Number(values.commissionPercentage))) {
        showToast("Please enter a valid number", "destructive");
        return;
      }
    }

    const payload = {
      bonusAmount: Number(values.bonusAmount),
      commissionPercentage: Number(values.commissionPercentage) / 100,
      email: props.email,
      staffCategory: props.staffCategory,
      selectedDate: props.selectedDate,
    };
    try {
      setLoading(true);
      await updateRewardApi(payload);

      if (props.query === "bonus" || !props.query) {
        showToast("Bonus updated successfully", "success");
      }
      if (props.query === "commission") {
        showToast("Commission updated successfully", "success");
      }
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

  const handleLoading = () => {
    if (props.query === "bonus" || !props.query) {
      return loading || !watch("bonusAmount");
    }

    if (props.query === "commission") {
      return loading || !watch("commissionPercentage");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="mb-1 font-medium">
        {" "}
        {!props.query || props.query === "bonus" ? "Bonus" : "Commission"}{" "}
      </h2>
      <h3 className="mb-6 text-xs font-normal italic text-grey7">
        {display()}
      </h3>
      {(props.query === "bonus" || !props.query) && (
        <Controller
          control={control}
          name="bonusAmount"
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder="Amount"
              label="Amount"
              value={field.value}
              wrapperClass={"w-full mb-4"}
              errorMessage={errors.commissionPercentage?.message}
            />
          )}
        />
      )}
      {props.query === "commission" && (
        <Controller
          control={control}
          name="commissionPercentage"
          render={({ field }) => (
            <SelectInput
              inputProps={{ ...field, value: field.value || "" }}
              placeholder={"Commission percentage"}
              options={Array.from({ length: 91 }, (_, index) => ({
                label: `${index}%`,
                value: `${index}`,
              }))}
              wrapperClass="mb-4"
              inputClass="!min-h-12"
              name={field.name}
              disabled={loading}
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value);
              }}
              emptyMessage={"No Discount"}
              errorMessage={errors.commissionPercentage?.message}
            />
          )}
        />
      )}

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
        <Button format="primary" type="submit" disabled={handleLoading()}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditRewardForm;
