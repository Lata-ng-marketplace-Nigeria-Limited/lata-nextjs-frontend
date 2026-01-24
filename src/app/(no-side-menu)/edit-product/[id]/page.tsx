import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { findAProductApi } from "@/api/product";
import { Suspense } from "react";
import { CreateOrEditProduct } from "@components/product/CreateOrEditProduct";
import EditProduct from "@components/product/EditProduct";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export const metadata: Metadata = {
  title: "Edit Product",
};

interface ISearchParms extends SwitchedRoleQueries { }

export default async function Page(props: {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<ISearchParms>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { id } = params;
  const session = await auth();

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
        <EditProduct id={id} queries={queries} />
      </Suspense>
    </div>
  );
}
