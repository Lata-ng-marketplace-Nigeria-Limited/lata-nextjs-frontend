import { Plan, PlanName, Subscription } from "@/interface/payment";
import { useEffect, useState } from "react";
import { planList } from "@/store/data/plan";
import Button from "@atom/Button";
import { PlanDetails } from "@components/subscription/PlanDetails";

interface Props {
  plans: Plan[];
  selectedSubscription: Subscription | undefined;
  activePlan: Plan | undefined;
}

export default function PlanSelect({
  selectedSubscription,
  plans,
  activePlan,
}: Props) {
  const [planName, setPlanName] = useState<PlanName>("Free");
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>();
  const [planOptions, setPlanOptions] = useState<PlanName[]>([]);
  const [hasSetActivePlan, setHasSetActivePlan] = useState(false);

  useEffect(() => {
    if (selectedSubscription?.type !== "COMBO") {
      setPlanOptions(planList);
      setPlanName("Free");
    } else {
      setPlanOptions([]);
      setPlanName("Verified");
    }
  }, [selectedSubscription]);

  useEffect(() => {
    if (!selectedSubscription || !activePlan) return;
    if (selectedSubscription.id !== activePlan?.subscription?.id) return;
    if (hasSetActivePlan) return;

    setPlanName(activePlan!.name);
    setSelectedMonth(activePlan!.duration);
    setHasSetActivePlan(true);
  }, [selectedSubscription, activePlan, hasSetActivePlan]);

  useEffect(() => {
    const selectedPlan = plans.filter((plan) => plan.name === planName);
    setSelectedPlans(selectedPlan);
  }, [plans, planName]);

  return (
    <div className={"mt-4 sm:mt-6"}>
      {planOptions.length ? (
        <div className={"gap-3 inline-flex overflow-x-auto pb-2 w-full"}>
          {planOptions.map((pName, i) => (
            <Button
              className={"sm:py-1 px-2 text-sm sm:text-base shrink-0"}
              format={planName === pName ? "primary" : "secondary"}
              onClick={() => {
                setPlanName(pName);
                setSelectedMonth(1);
              }}
              key={i}
            >
              {pName}
            </Button>
          ))}
        </div>
      ) : null}

      <div>
        <PlanDetails
          selectedMonth={selectedMonth}
          selectedPlans={selectedPlans}
          setSelectedMonth={setSelectedMonth}
          planName={planName}
          months={planName !== "Free" ? [1, 3, 6, 12] : []}
        />
      </div>
    </div>
  );
}
