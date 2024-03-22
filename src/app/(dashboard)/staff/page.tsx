import { getAllStaffAdminApi } from "@/api/admin";
import AllStaff from "@/components/admin/AllStaff";
import { GetUser } from "@/components/atom/GetUser";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Staff",
};

export default async function Protected({
  searchParams,
}: {
  searchParams: {
    page: string;
    limit: string;
    query?: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const page = searchParams?.page || "";
  const limit = searchParams?.limit || "";
  const query = searchParams?.query || "";
  const response = await getAllStaffAdminApi({ page, limit, query });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <AllStaff data={response.data} meta={response.meta} />
    </div>
  );
}
