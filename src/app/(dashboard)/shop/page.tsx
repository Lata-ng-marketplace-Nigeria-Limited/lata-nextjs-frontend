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

export const metadata: Metadata = {
  title: "My Shop",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    tab?: string;
  };
}) {
  unstable_noStore();
  const session = await getServerSession(authConfig);
  const page = searchParams?.page || "";
  const tab = searchParams?.tab || "";

  const products = await findAllMyProductsApi({
    page,
    tab,
  });

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <ShopTopArea statusCounts={products?.statusCounts || 0} />
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
