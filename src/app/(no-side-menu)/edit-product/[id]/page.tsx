import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { findAProductApi } from "@/api/product";
import { Suspense } from "react";
import { CreateOrEditProduct } from "@components/product/CreateOrEditProduct";
import EditProduct from "@components/product/EditProduct";
import { authConfig } from "@authConfig";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export const metadata: Metadata = {
  title: "Edit Product",
};

interface ISearchParms extends SwitchedRoleQueries {}

export default async function Page({
  params: { id },
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams: ISearchParms;
}) {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/auth");
  }

  if (session.role === "BUYER") {
    redirect("/");
  }
  const queries: ISearchParms = {
    role: searchParams?.role || "",
    sessionSwitched: searchParams?.sessionSwitched || "",
    uid: searchParams?.uid || "",
  };

  const data = await findAProductApi(id, queries);
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <Suspense key={id} fallback={<div>Loading</div>}>
        <EditProduct id={id} queries={queries}/>
      </Suspense>
    </div>
  );
}
