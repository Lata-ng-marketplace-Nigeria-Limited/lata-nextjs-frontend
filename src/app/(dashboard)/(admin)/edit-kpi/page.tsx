import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import EditTarget from "@/components/kpi/EditTarget";
import EditReward from "@/components/kpi/EditReward";

export const metadata: Metadata = {
  title: "Edit KPI",
};

export default async function Protected() {
  const session = await auth();
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <div className="mb-16">
        <EditTarget />
      </div>
      <EditReward />
    </div>
  );
}
