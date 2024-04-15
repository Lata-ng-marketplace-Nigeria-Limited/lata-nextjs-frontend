import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { NotificationWrapper } from "@components/notifications/NotificationWrapper";
import { unstable_noStore } from "next/cache";
import { authConfig } from "@authConfig";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { SearchQuery } from "@/interface/general";

export const metadata: Metadata = {
  title: "Notifications",
};

interface ISearchParams extends SwitchedRoleQueries, SearchQuery {}

export default async function Page({
  searchParams,
}: {
  searchParams?: ISearchParams;
}) {
  unstable_noStore();
  const session = await getServerSession(authConfig);
  const page = searchParams?.page || "";
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  const queries: ISearchParams = {
    role: searchParams?.role || "",
    sessionSwitched: searchParams?.sessionSwitched || "",
    uid: searchParams?.uid || "",
    page: searchParams?.page || "1",
  };

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense key={page} fallback={<p>Loading..</p>}>
        <NotificationWrapper queries={queries} />
      </Suspense>
    </div>
  );
}
