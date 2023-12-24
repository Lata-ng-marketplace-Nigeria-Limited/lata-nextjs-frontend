import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@authConfig";
import HeaderText from "@atom/HeaderText";
import { LegalCardArea } from "@organism/LegalCardArea";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Legal Docs",
};

export default async function Page() {
  const session = await getServerSession(authConfig);
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
