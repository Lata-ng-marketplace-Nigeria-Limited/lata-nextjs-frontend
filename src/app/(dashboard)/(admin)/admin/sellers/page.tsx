import { getAllSellersAdminApi } from "@/api/analytics";
import AllSellers from "@/components/admin/AllSellers";
import TableTopArea from "@/components/admin/TableTopArea";
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
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const page = searchParams?.page || "";
  const limit = searchParams?.limit || "";
  const response = await getAllSellersAdminApi({ page, limit });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <TableTopArea />

      <Suspense fallback={<p>Loading...</p>}>
        <AllSellers data={response.data} meta={response.meta} />
      </Suspense>
    </div>
  );
}
