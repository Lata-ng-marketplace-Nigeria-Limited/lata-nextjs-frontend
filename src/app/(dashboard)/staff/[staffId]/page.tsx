import { getStaffApi } from "@/api/staff";
import { GetUser } from "@/components/atom/GetUser";
import StaffProfileWrapper from "@/components/staff/StaffProfileWrapper";
import { authConfig } from "@authConfig";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

async function Page({
  params: { staffId },
}: {
  params: {
    staffId: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const response = await getStaffApi({ staffId });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <StaffProfileWrapper
          data={response.data}
          staffId={staffId}
          totalSellers={response?.totalSellers || 0}
        />
      </Suspense>
    </div>
  );
}

export default Page;
