import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import HeaderText from "@atom/HeaderText";
import { Suspense } from "react";
import { EditPlansWrapper } from "@components/edit-plans/EditPlansWrapper";
import { GetUser } from "@atom/GetUser";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export const metadata: Metadata = {
  title: "Edit Plan",
};

interface ISearchParams extends SwitchedRoleQueries {}

export default async function Protected({
  searchParams,
}: {
  searchParams?: ISearchParams;
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
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
      <HeaderText title>Edit plans</HeaderText>

      {/*<Suspense fallback={<div>Loading...</div>}>*/}
      <EditPlansWrapper queries={queries} />
      {/*</Suspense>*/}
    </div>
  );
}
