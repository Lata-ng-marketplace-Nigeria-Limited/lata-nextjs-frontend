import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MyShop } from "@components/shop/MyShop";
import { Suspense } from "react";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { unstable_noStore } from "next/cache";
import { authConfig } from "@authConfig";
import ShopTopArea from "@/components/shop/ShopTopArea";
import { findAllSellerProductsApi } from "@/api/admin";
import { getAllStatesApi } from "@/api/location";

interface IPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: IPageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { id } = params;
  const page = searchParams?.page || "";
  const status = searchParams?.status || "";

  const info = {
    page,
    status,
    sellerId: id,
  };

  const products = await findAllSellerProductsApi(info);
  const statesInNigeriaData = await getAllStatesApi();

  return {
    title: products?.seller?.name + " Shop",
  };
}

export default async function Page(props: IPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { id } = params;
  unstable_noStore();
  const session = await getServerSession(authConfig);
  const page = searchParams?.page || "";
  const status = searchParams?.status || "";

  const info = {
    page,
    status,
    sellerId: id,
  };

  const products = await findAllSellerProductsApi(info);
  const statesInNigeriaData = await getAllStatesApi();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <ShopTopArea
        statusCounts={products?.statusCounts || 0}
        seller={products?.seller}
      />
      <Suspense key={page} fallback={<ProductListSkeleton />}>
        <MyShop
          statesInNigeria={statesInNigeriaData?.data || []}
          products={products.data}
          meta={products?.meta}
          isEmpty={products?.isEmpty}
        />
      </Suspense>
    </div>
  );
}
