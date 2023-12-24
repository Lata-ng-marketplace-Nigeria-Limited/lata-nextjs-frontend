import React, { SetStateAction } from "react";
import { Subscription } from "@/interface/payment";
import HeaderText from "@atom/HeaderText";
import HeaderSubText from "@atom/HeaderSubText";
import { SubscriptionCardList } from "@components/subscription/SubscriptionCardList";

interface Props {
  setSelectedSubscription: React.Dispatch<
    SetStateAction<Subscription | undefined>
  >;
  subscriptions: Subscription[];
}

export default function AllSubList({
  setSelectedSubscription,
  subscriptions,
}: Props) {
  return (
    <div>
      <HeaderText title>
        Increase your product sales with our subscription packages
      </HeaderText>
      <HeaderSubText>
        Choose the right category of ads for you products to experience massive
        sales
      </HeaderSubText>

      <SubscriptionCardList
        subscriptions={subscriptions}
        setSelectedSubscription={setSelectedSubscription}
      />
    </div>
  );
}
