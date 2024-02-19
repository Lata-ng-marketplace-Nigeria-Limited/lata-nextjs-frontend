import { getAllBuyersAdminApi } from "@/api/admin";
import AllBuyers from "@/components/admin/AllBuyers";
import { GetUser } from "@/components/atom/GetUser";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Buyers",
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
  const response = await getAllBuyersAdminApi({ page, limit, verified });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <AllBuyers
          data={response.data}
          meta={response.meta}
          countVerifiedBuyers={response?.countVerifiedBuyers}
          countUnverifiedBuyers={response?.countUnverifiedBuyers}
        />
      </Suspense>
    </div>
  );
}
