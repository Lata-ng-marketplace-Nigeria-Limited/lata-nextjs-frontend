import React, { SetStateAction, useEffect, useState } from "react";
import { Plan, Subscription } from "@/interface/payment";
import HeaderText from "@atom/HeaderText";
import { SubscriptionCardList } from "@components/subscription/SubscriptionCardList";
import PlanSelect from "@components/subscription/PlanSelect";

interface Props {
  setSelectedSubscription: React.Dispatch<
    SetStateAction<Subscription | undefined>
  >;
  notSelectedSubs: Subscription[];
  selectedSubscription: Subscription | undefined;
  activePlan: Plan | undefined;
}

export default function SelectedSubDetails({
  notSelectedSubs,
  setSelectedSubscription,
  selectedSubscription,
  activePlan,
}: Props) {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    if (selectedSubscription) {
      setPlans(selectedSubscription.plans || []);
    }
  }, [selectedSubscription]);

  return (
    <div>
      <HeaderText title>
        Available plans for {selectedSubscription?.name.toLowerCase()} ads
      </HeaderText>

      <PlanSelect
        plans={plans}
        selectedSubscription={selectedSubscription}
        activePlan={activePlan}
      />

      <div className={"mt-6 sm:mt-[44px]"}>
        <HeaderText>Have a different products?</HeaderText>

        <SubscriptionCardList
          subscriptions={notSelectedSubs}
          setSelectedSubscription={setSelectedSubscription}
          wrapperClass={"xs:mt-6"}
        />
      </div>
    </div>
  );
}
