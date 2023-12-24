"use client";
import { Subscription } from "@/interface/payment";
import { useEffect, useState } from "react";
import AllSubList from "@components/subscription/AllSubList";
import SelectedSubDetails from "@components/subscription/SelectedSubDetails";
import { useUser } from "@hooks/useUser";

interface Props {
  subscriptions: Subscription[];
}
export const Subscriptions = ({ subscriptions }: Props) => {
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription>();
  const [notSelectedSubs, setNotSelectedSubs] = useState<Subscription[]>([]);
  const [hasSetActiveSub, setHasSetActiveSub] = useState(false);
  const { activePlan, user } = useUser();

  useEffect(() => {
    console.log({
      activePlan,
      user,
    });
  }, [activePlan, user]);

  useEffect(() => {
    if (selectedSubscription) {
      setNotSelectedSubs(
        subscriptions.filter((sub) => sub.id !== selectedSubscription!.id),
      );
    }
  }, [selectedSubscription, subscriptions]);

  useEffect(() => {
    if (!hasSetActiveSub && activePlan && subscriptions) {
      const activeSub = subscriptions.find(
        (sub) => sub.id === activePlan?.subscription?.id,
      );
      if (activeSub) {
        setSelectedSubscription(activeSub);
        setHasSetActiveSub(true);
      }
    }
  }, [activePlan, hasSetActiveSub, subscriptions]);

  return (
    <div>
      {selectedSubscription ? (
        <SelectedSubDetails
          setSelectedSubscription={setSelectedSubscription}
          notSelectedSubs={notSelectedSubs}
          selectedSubscription={selectedSubscription}
          activePlan={activePlan}
        />
      ) : (
        <AllSubList
          setSelectedSubscription={setSelectedSubscription}
          subscriptions={subscriptions}
        />
      )}
    </div>
  );
};
