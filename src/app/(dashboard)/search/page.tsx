import { Metadata } from "next";
import HeaderText from "@atom/HeaderText";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { SearchProducts } from "@components/product/SearchProducts";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";

export const metadata: Metadata = {
  title: "Search Products",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    loc?: string;
    page?: string;
  };
}) {
  const session = await getServerSession(authConfig);

  const search = searchParams?.q || "";
  const location = searchParams?.loc || "";
  const page = searchParams?.page || "";

  return (
    <div className={"flex flex-col gap-y-2"}>
      <HeaderText title>Products</HeaderText>

      <Suspense key={search + page} fallback={<ProductListSkeleton />}>
        <SearchProducts
          search={search}
          location={location}
          page={page}
          token={session?.token}
        />
      </Suspense>
    </div>
  );
}
