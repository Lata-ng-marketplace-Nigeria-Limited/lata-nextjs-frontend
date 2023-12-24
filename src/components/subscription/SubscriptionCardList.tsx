import { Subscription } from "@/interface/payment";
import SubscriptionCard from "@components/subscription/SubscriptionCard";
import React from "react";
import { cn } from "@/utils";

interface Props {
  subscriptions: Subscription[];
  setSelectedSubscription: React.Dispatch<
    React.SetStateAction<Subscription | undefined>
  >;
  wrapperClass?: string;
}
export const SubscriptionCardList = ({
  subscriptions,
  setSelectedSubscription,
  wrapperClass,
}: Props) => {
  return (
    <div
      className={cn(
        "mt-4 xs:mt-8 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6",
        wrapperClass,
      )}
    >
      {subscriptions.map((sub) => (
        <SubscriptionCard
          name={sub.name}
          key={sub.id}
          imageSrc={sub.meta.image}
          bgColor={sub.meta.color}
          onClick={() => setSelectedSubscription(sub)}
        />
      ))}
    </div>
  );
};
