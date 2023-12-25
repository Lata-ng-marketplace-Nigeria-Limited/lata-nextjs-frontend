import HeaderSubText from "@/components/atom/HeaderSubText";
import HeaderText from "@/components/atom/HeaderText";
import React, { Suspense } from "react";
import { AnalyticsWrapper } from "@components/analytics/AnalyticsWrapper";

const page = () => {
  return (
    <div>
      <HeaderText title>Seller Analytics</HeaderText>
      <HeaderSubText>HI Anthony, Welcome back!</HeaderSubText>

      <Suspense fallback={<div>Loading</div>}>
        <AnalyticsWrapper />
      </Suspense>
    </div>
  );
};

export default page;
