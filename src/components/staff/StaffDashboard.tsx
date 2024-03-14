import React from "react";
import StaffTopCards from "./StaffTopCards";
import { staffPerformance } from "@/api/staff";
import Targets from "@components/staff/Targets";
import Bonuses from "@components/staff/Bonuses";
import { months } from "@/store/data/analytics";
import { PerformanceOverview } from "@/interface/staff";
import StaffAnalyticsArea from "./StaffAnalyticsArea";

interface Props {
  staffId: string;
  month: string;
}

const StaffDashboard = async (props: Props) => {
  const staffPerf = await staffPerformance({
    staffId: props.staffId,
    month: props.month,
  });
  const monthInFull =
    months[Number(staffPerf?.statsOverView?.month) - 1]?.extra ?? "";

  return (
    <div>
      <StaffTopCards
        staffId={props.staffId}
        data={staffPerf?.data}
        statsOverview={staffPerf?.statsOverView as PerformanceOverview}
      />
      <StaffAnalyticsArea staffPerf={staffPerf} month={props.month} />

      <div className="gap-3 xms:flex sm:block">
        <Targets
          wrapperClass="basis-[50%]"
          targets={staffPerf?.targets}
          sales={staffPerf?.data?.amount}
          targetPay={JSON.parse(staffPerf?.data?.targetInformation || "{}")}
        />
        <Bonuses wrapperClass="basis-[50%]" bonuses={staffPerf?.bonuses} />
      </div>
    </div>
  );
};

export default StaffDashboard;
