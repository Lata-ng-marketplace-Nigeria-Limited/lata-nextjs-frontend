import { getAllPaidSellersAdminApi, getAllSellersAdminApi } from "@/api/admin";
import AllSellers from "@/components/admin/AllSellers";
import PaidSellers from "@/components/admin/PaidSellers";
import { GetUser } from "@/components/atom/GetUser";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Paid Sellers",
};

export default async function Protected({
  searchParams,
}: {
  searchParams: {
    page: string;
    limit: string;
    transactionStatus: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const page = searchParams?.page || "";
  const limit = searchParams?.limit || "";
  const transactionStatus = searchParams?.transactionStatus || "";
  const response = await getAllPaidSellersAdminApi({
    page,
    limit,
    transactionStatus,
  });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <PaidSellers
          data={response?.data}
          activeSubscriptionCount={response?.activeSubscriptionCount}
          dueSubscriptionCount={response?.dueSubscriptionCount}
          newSubscriptionCount={response?.newSubscriptionCount}
          unSubscribedUsersCount={response?.unSubscribedUsersCount}
          meta={response?.meta}
        />
      </Suspense>
    </div>
  );
}
