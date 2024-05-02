import { getAllPaidSellersAdminApi } from "@/api/admin";
import PaidSellers from "@/components/admin/PaidSellers";
import { GetUser } from "@/components/atom/GetUser";
import CentralizedRollerSpinner from "@/components/molecule/CentralizedRollerSpinner";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Paid Sellers",
};

export default async function Protected({
  params: { staffId },
  searchParams,
}: {
  searchParams: {
    page: string;
    limit: string;
    tab: string;
  };
  params: {
    staffId: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (
    !session ||
    !session.user ||
    (session.role !== "ADMIN" && session.role !== "STAFF")
  ) {
    redirect("/");
  }

  const page = searchParams?.page || "";
  const limit = searchParams?.limit || "";
  const tab = searchParams?.tab || "";
  const response = await getAllPaidSellersAdminApi({
    page,
    limit,
    tab,
    staffId,
  });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense fallback={<CentralizedRollerSpinner />}>
        <PaidSellers
          data={response?.data}
          activeSubscriptionCount={response?.activeSubscriptionCount}
          dueSubscriptionCount={response?.dueSubscriptionCount}
          newSubscriptionCount={response?.newSubscriptionCount}
          returningSubscribersCount={response?.returningSubscribersCount}
          meta={response?.meta}
        />
      </Suspense>
    </div>
  );
}
