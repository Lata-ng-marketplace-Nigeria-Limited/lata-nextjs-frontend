import { GetUser } from "@/components/atom/GetUser";
import StaffProfileWrapper from "@/components/staff/StaffProfileWrapper";
import { authConfig } from "@authConfig";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

async function Page({
  params: { staffId },
  searchParams,
}: {
  params: {
    staffId: string;
  };
  searchParams?: {
    month: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const month = searchParams?.month || "";

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <StaffProfileWrapper staffId={staffId} month={month} />
      </Suspense>
    </div>
  );
}

export default Page;
