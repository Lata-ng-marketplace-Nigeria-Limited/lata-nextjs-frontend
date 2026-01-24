import { getSellersUnderStaffApi } from "@/api/staff";
import { GetUser } from "@/components/atom/GetUser";
import CentralizedRollerSpinner from "@/components/molecule/CentralizedRollerSpinner";
import StaffSellers from "@/components/staff/StaffSellers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

async function Page(props: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!session || !session.user || session.role !== "STAFF") {
    redirect("/");
  }
  const page = searchParams?.page || "";

  const response = await getSellersUnderStaffApi({ page });
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
