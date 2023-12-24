import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import HeaderText from "@atom/HeaderText";
import { cn } from "@/utils";
import { VerifyTransfer } from "@components/verify-transfer/VerifyTransfer";
import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";

export const metadata: Metadata = {
  title: "Verify Transfer",
};

export default async function Protected() {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className={cn(`flex flex-col gap-y-6`)}>
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title>Verify transfers</HeaderText>

      <VerifyTransfer />
    </div>
  );
}
