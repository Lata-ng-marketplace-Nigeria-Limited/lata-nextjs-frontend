import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SubscriptionListSkeleton } from "@components/skeleton/SubscriptionListSkeleton";
import { Suspense } from "react";
import { SubscriptionsWrapper } from "@components/subscription/SubscriptionsWrapper";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export const metadata: Metadata = {
  title: "Subscriptions",
};

interface ISearchParams extends SwitchedRoleQueries { }

export default async function Page(props: {
  searchParams: Promise<ISearchParams>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();

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
