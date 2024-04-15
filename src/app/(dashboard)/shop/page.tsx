import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MyShop } from "@components/shop/MyShop";
import { Suspense } from "react";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { unstable_noStore } from "next/cache";
import { authConfig } from "@authConfig";
import { findAllMyProductsApi } from "@/api/product";
import ShopTopArea from "@/components/shop/ShopTopArea";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export const metadata: Metadata = {
  title: "My Shop",
};

interface ISearchParams extends SwitchedRoleQueries {
  page?: string;
  tab?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: ISearchParams;
}) {
  unstable_noStore();
  const session = await getServerSession(authConfig);

  const queries: ISearchParams = {
    page: searchParams?.page || "",
    tab: searchParams?.tab || "",
    role: searchParams?.role || "",
    sessionSwitched: searchParams?.sessionSwitched || "",
    uid: searchParams?.uid || "",
  };

  const products = await findAllMyProductsApi(queries);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <ShopTopArea statusCounts={products?.statusCounts || 0} />
      <Suspense key={queries.page} fallback={<ProductListSkeleton />}>
        <MyShop
          products={products.data}
          meta={products?.meta}
          isEmpty={products?.isEmpty}
        />
      </Suspense>
    </div>
  );
}
