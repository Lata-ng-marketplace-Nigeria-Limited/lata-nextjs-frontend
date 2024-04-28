import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SubscriptionListSkeleton } from "@components/skeleton/SubscriptionListSkeleton";
import { Suspense } from "react";
import { SubscriptionsWrapper } from "@components/subscription/SubscriptionsWrapper";
import { authConfig } from "@authConfig";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export const metadata: Metadata = {
  title: "Subscriptions",
};

interface ISearchParams extends SwitchedRoleQueries {}

export default async function Page({
  searchParams,
}: {
  searchParams?: ISearchParams;
}) {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const queries: SwitchedRoleQueries = {
    uid: searchParams?.uid || "",
    sessionSwitched: searchParams?.sessionSwitched || "",
    role: searchParams?.role || "",
  };
  
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense fallback={<SubscriptionListSkeleton />}>
        <SubscriptionsWrapper queries={queries} />
      </Suspense>
    </div>
  );
}
