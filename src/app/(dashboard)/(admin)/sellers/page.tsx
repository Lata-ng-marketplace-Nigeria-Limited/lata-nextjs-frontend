import { getAllSellersAdminApi } from "@/api/admin";
import AllSellers from "@/components/admin/AllSellers";
import { GetUser } from "@/components/atom/GetUser";
import CentralizedRollerSpinner from "@/components/molecule/CentralizedRollerSpinner";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sellers",
};

export default async function Protected({
  searchParams,
}: {
  searchParams: {
    page: string;
    query?: string;
    limit: string;
    tab: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const query = searchParams?.query || "";
  const page = searchParams?.page || "";
  const limit = searchParams?.limit || "";
  const tab = searchParams?.tab || "";
  const response = await getAllSellersAdminApi({ page, limit, tab, query });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense fallback={<CentralizedRollerSpinner />}>
        <AllSellers
          data={response.data}
          meta={response.meta}
          countVerifiedSellers={response?.countVerifiedSellers}
          countUnverifiedSellers={response?.countUnVerifiedSellers}
          usersWithNoUploadsCount={response?.usersWithNoUploadsCount}
        />
      </Suspense>
    </div>
  );
}
