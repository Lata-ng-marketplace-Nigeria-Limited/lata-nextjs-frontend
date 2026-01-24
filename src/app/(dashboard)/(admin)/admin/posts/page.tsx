import { getAllPosts } from "@/api/admin";
import { getAllStatesApi } from "@/api/location";
import AllPosts from "@/components/admin/AllPosts";
import { GetUser } from "@/components/atom/GetUser";
import CentralizedRollerSpinner from "@/components/molecule/CentralizedRollerSpinner";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Posts",
};

export default async function Protected(props: {
  searchParams: Promise<{
    query?: string;
    page: string;
    limit: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const query = searchParams?.query || "";
  const page = searchParams?.page || "";
  const limit = searchParams?.limit || "";
  const response = await getAllPosts({ page, limit, query });
  const location = await getAllStatesApi();

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense fallback={<CentralizedRollerSpinner />}>
        <AllPosts
          data={response.data}
          meta={response.meta}
          states={location?.data}
        />
      </Suspense>
    </div>
  );
}
