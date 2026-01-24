import { getAllStaffAdminApi } from "@/api/admin";
import AllStaff from "@/components/admin/AllStaff";
import { GetUser } from "@/components/atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Staff",
};

export default async function Protected(props: {
  searchParams: Promise<{
    page: string;
    limit: string;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
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
