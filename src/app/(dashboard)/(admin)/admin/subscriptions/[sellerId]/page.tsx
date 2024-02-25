import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SubscriptionListSkeleton } from "@components/skeleton/SubscriptionListSkeleton";
import { Suspense } from "react";
import { SubscriptionsWrapper } from "@components/subscription/SubscriptionsWrapper";
import { authConfig } from "@authConfig";

export const metadata: Metadata = {
  title: "Subscriptions",
};

export default async function Page({
  params: { sellerId },
}: {
  params: {
    sellerId: string;
  };
}) {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/auth/login");
  }
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense fallback={<SubscriptionListSkeleton />}>
        <SubscriptionsWrapper sellerId={sellerId} />
      </Suspense>
    </div>
  );
}
