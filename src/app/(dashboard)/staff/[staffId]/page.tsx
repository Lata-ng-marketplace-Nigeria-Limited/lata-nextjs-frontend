import { GetUser } from "@/components/atom/GetUser";
import StaffProfileWrapper from "@/components/staff/StaffProfileWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

async function Page(props: {
  params: Promise<{
    staffId: string;
  }>;
  searchParams: Promise<{
    month: string;
  }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { staffId } = params;
  const session = await auth();
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
