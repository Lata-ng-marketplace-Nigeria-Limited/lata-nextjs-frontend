import { getAllSubscriptionsApi } from "@/api/subscription";
import { EditPlans } from "@components/edit-plans/EditPlans";

export const EditPlansWrapper = async () => {
  const subscriptions = await getAllSubscriptionsApi();

  return <EditPlans subscriptions={subscriptions?.subscriptions} />;
};
