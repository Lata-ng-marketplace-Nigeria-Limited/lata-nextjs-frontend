import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HeaderText from "@atom/HeaderText";
import { MyShop } from "@components/shop/MyShop";
import { Suspense } from "react";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { unstable_noStore } from "next/cache";
import { authConfig } from "@authConfig";
import { findAllMyProductsApi } from "@/api/product";
import ProductStatusList from "@/components/shop/ProductStatus";

export const metadata: Metadata = {
  title: "My Shop",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    status?: string;
  };
}) {
  unstable_noStore();
  const session = await getServerSession(authConfig);
  const page = searchParams?.page || "";
  const status = searchParams?.status || "";

  const products = await findAllMyProductsApi({
    page,
    status,
  });

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <div className="items-center justify-between sl:flex">
        <HeaderText title>My Shop</HeaderText>
        <ProductStatusList
          status={status}
          statusCounts={products?.statusCounts}
        />
      </div>
      <Suspense key={page} fallback={<ProductListSkeleton />}>
        <MyShop
          products={products.data}
          meta={products?.meta}
          isEmpty={products?.isEmpty}
        />
      </Suspense>
    </div>
  );
}
