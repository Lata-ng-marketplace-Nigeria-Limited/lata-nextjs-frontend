import { getSellersUnderStaffApi } from "@/api/staff";
import { GetUser } from "@/components/atom/GetUser";
import StaffSellers from "@/components/staff/StaffSellers";
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

  const response = await getSellersUnderStaffApi({ staffId });
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <Suspense fallback={<p>Loading...</p>}>
        <StaffSellers
          data={response?.data}
          meta={response?.meta}
          staff={response?.staff}
        />
      </Suspense>
    </div>
  );
}

export default Page;
