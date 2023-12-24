import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SalesAgreement } from "@components/sales-agreement/SalesAgreement";
import { SalesMessageUs } from "@components/sales-agreement/SalesMessageUs";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sales Agreement",
};

export default async function Page() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/auth/login");
  }
  return (
    <div className={"flex flex-col gap-y-6 sm:gap-y-[2.5rem]"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <SalesAgreement />
      <SalesMessageUs />
    </div>
  );
}
