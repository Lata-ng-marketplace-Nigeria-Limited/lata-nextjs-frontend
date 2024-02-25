import StaffProfileWrapper from "@/components/staff/StaffProfileWrapper";
import React from "react";

async function Page({
    params: { staffId },
  }: {
    params: {
      staffId: string;
    };
  }) {
  return (
    <div>
      <StaffProfileWrapper staffId={staffId}/>
    </div>
  );
}

export default Page;
