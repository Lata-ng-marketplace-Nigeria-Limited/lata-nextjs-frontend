import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import HeaderText from "@atom/HeaderText";
import { GetUser } from "@atom/GetUser";
import { AuditLogsListWrapper } from "@/components/admin/AuditLogsListWrapper";

export const metadata: Metadata = {
  title: "Admin Audit Logs",
};

export default async function Page(props: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    tab?: string;
    activityType?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const search = searchParams?.q || "";
  const page = searchParams?.page || "1";
  const tab = searchParams?.tab || "ALL";
  const activityType = searchParams?.activityType || "";

  return (
    <div className={"flex flex-col gap-y-6 px-4 py-6 sm:px-6"}>
      <Suspense>
        <GetUser />
      </Suspense>
      
      <div className="flex flex-col gap-y-2 border-b border-grey2 pb-4">
        <HeaderText title>Admin Audit Logs</HeaderText>
        <p className="text-sm text-grey6">Monitor activity logs of administrators and staff impersonating other users.</p>
      </div>

      <Suspense fallback={<div>Loading activity logs...</div>}>
        <AuditLogsListWrapper page={page} search={search} tab={tab} activityType={activityType} />
      </Suspense>
    </div>
  );
}
