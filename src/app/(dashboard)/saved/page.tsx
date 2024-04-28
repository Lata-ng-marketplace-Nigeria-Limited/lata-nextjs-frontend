import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HeaderText from "@atom/HeaderText";
import { Suspense } from "react";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { SavedProducts } from "@components/saved/SavedProducts";
import { unstable_noStore } from "next/cache";
import { authConfig } from "@authConfig";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { findMySavedProductsApi } from "@/api/product";
import { getAllStatesApi } from "@/api/location";

export const metadata: Metadata = {
  title: "Saved Products",
};

interface ISearchParams extends SwitchedRoleQueries {
  page?: string;
  limit?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: ISearchParams;
}) {
  unstable_noStore();
  const session = await getServerSession(authConfig);
  const page = searchParams?.page || "";
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  const queries: ISearchParams = {
    page: searchParams?.page || "",
    role: searchParams?.role || "",
    sessionSwitched: searchParams?.sessionSwitched || "",
    uid: searchParams?.uid || "",
    limit: searchParams?.limit || "",
  };

  const res = await findMySavedProductsApi(queries);
  const statesInNigeriaData = await getAllStatesApi();

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title>Saved Products</HeaderText>
      <Suspense key={page} fallback={<ProductListSkeleton />}>
        <SavedProducts
          data={res.data}
          meta={res.meta}
          statesInNigeria={statesInNigeriaData?.data || []}
        />
      </Suspense>
    </div>
  );
}
