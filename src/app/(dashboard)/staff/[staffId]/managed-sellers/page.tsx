import { adminFetchSellersUnderStaff } from "@/api/admin";
import { GetUser } from "@/components/atom/GetUser";
import CentralizedRollerSpinner from "@/components/molecule/CentralizedRollerSpinner";
import StaffSellers from "@/components/staff/StaffSellers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

async function Page(props: {
  params: Promise<{
    staffId: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { staffId } = params;
  const session = await auth();
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
