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
    if (selectedSubscription) {
      setNotSelectedSubs(
        subscriptions.filter((sub) => sub.id !== selectedSubscription!.id),
      );
    }
  }, [selectedSubscription, subscriptions]);

  useEffect(() => {
    // console.log(
    //   "hasSetActiveSub",
    //   hasSetActiveSub,
    //   "activePlan",
    //   activePlan,
    //   "subscriptions",
    //   subscriptions,
    // );
    if (!hasSetActiveSub && activePlan && subscriptions) {
      const targetSubId =
        activePlan?.subscription?.id ||
        (activePlan as any)?.subscriptionId ||
        user?.subscriptionId;
      const activeSub = subscriptions.find((sub) => sub.id === targetSubId);
      if (activeSub) {
        setSelectedSubscription(activeSub);
        setHasSetActiveSub(true);
      }
    }
  }, [activePlan, user?.subscriptionId, hasSetActiveSub, subscriptions]);

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
