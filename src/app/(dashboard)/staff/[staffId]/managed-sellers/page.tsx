import { adminFetchSellersUnderStaff } from "@/api/admin";
import { GetUser } from "@/components/atom/GetUser";
import CentralizedRollerSpinner from "@/components/molecule/CentralizedRollerSpinner";
import StaffSellers from "@/components/staff/StaffSellers";
import { authConfig } from "@authConfig";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

async function Page({
  params: { staffId },
  searchParams,
}: {
  params: {
    staffId: string;
  };
  searchParams?: {
    page?: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }
  const page = searchParams?.page || "";

  const response = await adminFetchSellersUnderStaff({ staffId, page });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <Suspense fallback={<CentralizedRollerSpinner />}>
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
