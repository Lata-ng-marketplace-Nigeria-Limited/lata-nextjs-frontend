import { getAllSellersAdminApi } from "@/api/admin";
import AllSellers from "@/components/admin/AllSellers";
import { GetUser } from "@/components/atom/GetUser";
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
    limit: string;
    verified: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const page = searchParams?.page || "";
  const limit = searchParams?.limit || "";
  const verified = searchParams?.verified || "";
  const response = await getAllSellersAdminApi({ page, limit, verified });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
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
