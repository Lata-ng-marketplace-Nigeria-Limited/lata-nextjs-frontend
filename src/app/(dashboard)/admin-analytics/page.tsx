import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import { getAdminAnalyticsApi } from "@/api/analytics";
import AdminAnalyticsWrapper from "@/components/analytics/AdminAnalytics";
import HeaderSubText from "@/components/atom/HeaderSubText";
import HeaderText from "@/components/atom/HeaderText";
import Button from "@/components/atom/Button";
import RecentPosts from "@/components/posts/RecentPosts";
import { getAnalyticsClicksAndViews } from "@/api/view";
import AnalyticsChart from "@/components/analytics/AnalyticsChart";

export const metadata: Metadata = {
  title: "Admin Analytics",
};

export default async function Protected() {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const response = await getAdminAnalyticsApi();
  const chartsData = await getAnalyticsClicksAndViews();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <HeaderText title>Admin Dashboard</HeaderText>
          <HeaderSubText>Hi {session?.user?.name}, Welcome back!</HeaderSubText>
        </div>
        <Button format="primary">Account Email</Button>
      </div>

      <Suspense>
        <GetUser />
      </Suspense>
      <AdminAnalyticsWrapper analyticsCount={response?.counts} />
      <AnalyticsChart chartsData={chartsData} />
      <RecentPosts reposts={response?.recentPosts} />
    </div>
  );
}
