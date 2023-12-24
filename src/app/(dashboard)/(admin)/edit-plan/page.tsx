import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import HeaderText from "@atom/HeaderText";
import { Suspense } from "react";
import { EditPlansWrapper } from "@components/edit-plans/EditPlansWrapper";
import { GetUser } from "@atom/GetUser";

export const metadata: Metadata = {
  title: "Edit Plan",
};

export default async function Protected() {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title>Edit plans</HeaderText>

      {/*<Suspense fallback={<div>Loading...</div>}>*/}
      <EditPlansWrapper />
      {/*</Suspense>*/}
    </div>
  );
}
