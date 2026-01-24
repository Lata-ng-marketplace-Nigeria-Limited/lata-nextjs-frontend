import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeaderText from "@atom/HeaderText";
import { LegalCardArea } from "@organism/LegalCardArea";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Legal Docs",
};

export default async function Page() {
  const session = await auth();
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title>Legal Docs</HeaderText>
      <Suspense fallback={<div>loading..</div>}>
        <LegalCardArea />
      </Suspense>
    </div>
  );
}
