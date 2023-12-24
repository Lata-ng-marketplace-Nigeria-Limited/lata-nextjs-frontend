"use client";

import { Plan, Subscription } from "@/interface/payment";
import { cn } from "@/utils";
import { SelectInput } from "@components/input/SelectInput";
import { FormEvent, useEffect, useState } from "react";
import { SearchOption } from "@/interface/input";
import { planDurationList, planList } from "@/store/data/plan";
import { NumberTextInput } from "@components/input/NumberTextInput";
import Button from "@atom/Button";
import { useToast } from "@components/ui/use-toast";
import { updatePlanApi } from "@/api/subscription";
import { revalidatePath } from "next/cache";
import { ADMIN_EDIT_PLAN_ROUTE } from "@/constants/routes";

interface Props {
  subscriptions: Subscription[];
}

export const EditPlans = ({ subscriptions }: Props) => {
  // const [subOptions, setSubOptions] = useState<SearchOption[]>([]);
  // const [planOptions, setPlanOptions] = useState<SearchOption[]>([]);
  const [plan, setPlan] = useState<Plan>();
  const [planName, setPlanName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [duration, setDuration] = useState("");
  const [loadingUpdate, setLoading] = useState(false);
  const [error, setError] = useState({
    price: "",
    discount: "",
  });
  // const [renderDuration, setRenderDuration] = useState(true);
  const [subId, setSubId] = useState("");
  const [subscriptionValue, setSubscriptionValue] = useState<Subscription>();
  const { toast } = useToast();

  const subOptions = subscriptions.map((sub) => ({
    value: sub.id,
    label: sub.name,
  }));

  const planOptions =
    subscriptionValue?.type === "COMBO"
      ? [
          {
            value: "Verified",
            label: "Verified",
          },
        ]
      : planList
          .filter((plan) => plan !== "Free")
          .map((plan) => ({
            value: plan,
            label: plan,
          })) || [];

  // useEffect(() => {
  //   console.log("subscriptions");
  //   if (!subscriptions) return;
  //   const options = subscriptions.map((sub) => ({
  //     value: sub.id,
  //     label: sub.name,
  //   }));
  //   setSubOptions(options);
  // }, [subscriptions]);

  // useEffect(() => {
  //   console.log("subId");
  //   if (!subId) return;
  //   setPlanName("");
  //   setDuration("");
  //   // setRender(false);
  //   // setRenderDuration(false);
  //   const sub = subscriptions.find((sub) => sub.id === subId);
  //   if (!sub) return;
  //   setSubscriptionValue(sub);
  // }, [subId, subscriptions]);

  // useEffect(() => {
  //   console.log("planName");
  //   if (!planName) return;
  //   setRenderDuration(false);
  //   setDuration("");
  // }, [planName]);

  // useEffect(() => {
  //   console.log("setPlan");
  //   // setPlan(undefined);
  //   setPrice("");
  //   setDiscount("");
  //   if (!duration) return;
  //   if (subscriptionValue) {
  //     const plan = subscriptionValue!.plans!.find(
  //       (plan) => plan.name === planName && plan.duration === Number(duration),
  //     );
  //     if (!plan) return;
  //     // setPlan(plan);
  //     // setPrice(plan.price.toString());
  //     // setDiscount(plan.discountPercentage.toString());
  //   }
  // }, [duration, planName, subscriptionValue]);

  // useEffect(() => {
  //   console.log("subscriptionValue");
  //   if (!subscriptionValue) return;
  //   const options =
  //     subscriptionValue?.type === "COMBO"
  //       ? [
  //           {
  //             value: "Verified",
  //             label: "Verified",
  //           },
  //         ]
  //       : planList
  //           .filter((plan) => plan !== "Free")
  //           .map((plan) => ({
  //             value: plan,
  //             label: plan,
  //           }));
  //   setPlanOptions(options);
  // }, [subscriptionValue]);

  const handleUpdatePlan = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!plan) return;
    if (!price) {
      setError((prev) => ({
        ...prev,
        price: "Price is required",
      }));
    }
    if (!discount) {
      setError((prev) => ({
        ...prev,
        discount: "Discount is required",
      }));
    }

    if (!price || !discount) return;
    setLoading(true);

    try {
      await updatePlanApi({
        id: plan!.id,
        discount: Number(discount),
        price: Number(price),
      });
      toast({
        title: "Success",
        description: "Plan updated successfully",
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePlan}>
      <div
        className={cn(`
        flex
        gap-x-3
        flex-col
        sm:flex-row
        gap-y-6
        sm:gap-x-6
        mt-6
      `)}
      >
        <SelectInput
          placeholder={"Select subscription"}
          options={subOptions}
          wrapperClass={cn("shrink")}
          setValue={setSubId}
          onValueChange={(value) => {
            setSubId(value);
            setPlanName("");
            setDuration("");
            setPrice("");
            setDiscount("");
            const sub = subscriptions.find((sub) => sub.id === value);
            if (!sub) return;
            setSubscriptionValue(sub);
          }}
          value={subId}
        />

        <SelectInput
          placeholder={"Select plan"}
          options={planOptions}
          wrapperClass={cn("shrink")}
          onValueChange={(value) => {
            setPlanName(value);
            setDuration("");
            setPrice("");
            setDiscount("");
          }}
          value={planName}
        />
      </div>

      <div
        className={cn(`
        flex
        gap-x-3
        flex-col
        sm:flex-row
        gap-y-6
        sm:gap-x-6
        mt-6
      `)}
      >
        <SelectInput
          placeholder={"Select duration"}
          options={planDurationList}
          wrapperClass={cn("shrink")}
          onValueChange={(value) => {
            setDuration(value);
            const plan = subscriptionValue?.plans?.find(
              (plan) =>
                plan.name === planName && plan.duration === Number(value),
            );
            setPlan(plan);
            setPrice(plan?.price.toString() || "");
            setDiscount(plan?.discountPercentage.toString() || "");
          }}
          value={duration}
        />

        <NumberTextInput
          placeholder={"Enter Price"}
          label={"Price"}
          wrapperClass={cn("w-full")}
          disabled={!plan}
          value={price}
          setValue={setPrice}
          onChange={() => {
            setError((prev) => ({
              ...prev,
              price: "",
            }));
          }}
          errorMessage={error.price}
        />
      </div>

      <div
        className={cn(`
        flex
        gap-x-6
        my-6
        
      `)}
      >
        <NumberTextInput
          placeholder={"Enter Discount"}
          label={"Discount"}
          wrapperClass={cn("w-full")}
          disabled={!plan}
          value={discount}
          setValue={setDiscount}
          onChange={() => {
            setError((prev) => ({
              ...prev,
              discount: "",
            }));
          }}
          errorMessage={error.discount}
        />
      </div>

      <Button
        format={"primary"}
        disabled={!plan || loadingUpdate}
        type={"submit"}
        // onClick={handleUpdatePlan}
      >
        Update
      </Button>
    </form>
  );
};
