import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MyShop } from "@components/shop/MyShop";
import { Suspense } from "react";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { unstable_noStore } from "next/cache";
import ShopTopArea from "@/components/shop/ShopTopArea";
import { findAllSellerProductsApi } from "@/api/admin";
import { getAllStatesApi } from "@/api/location";
import { getReelsApi } from "@/api/reels";

interface IPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    tab?: string;
    type?: string;
  }>;
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: IPageProps): Promise<Metadata> {
  const [searchParams, params, statesInNigeriaData] = await Promise.all([
    props.searchParams,
    props.params,
    getAllStatesApi(),
  ]);
  const { id } = params;
  const page = searchParams?.page || "";
  const status = searchParams?.status || searchParams?.tab || "";

  const info = {
    page,
    status,
    sellerId: id,
  };

  const products = await findAllSellerProductsApi(info);

  return {
    title: products?.seller?.name + " Shop",
  };
}

export default async function Page(props: IPageProps) {
  const [searchParams, params, session] = await Promise.all([
    props.searchParams,
    props.params,
    auth(),
  ]);
  const { id } = params;
  unstable_noStore();
  const page = searchParams?.page || "";
  const status = searchParams?.status || searchParams?.tab || "";
  const activeView = searchParams?.type === "reels" ? "reels" : "products";

  const info = {
    page,
    status,
    sellerId: id,
  };

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const [products, statesInNigeriaData, reelsData] = await Promise.all([
    findAllSellerProductsApi(info),
    getAllStatesApi(),
    getReelsApi({ sellerId: id }),
  ]);

  const sellerReels = reelsData?.reels ? reelsData.reels.flatMap((g) => g.reels) : [];
  const reelsStatusCounts = {
    active: sellerReels.filter((r) => r.status === "ACTIVE" || !r.status).length,
    reviewing: sellerReels.filter((r) => r.status === "INACTIVE").length,
    denied: sellerReels.filter((r) => r.status === "CANCELLED").length,
    draft: 0,
    other: 0,
    unsubscribed: 0,
  };

  const statusCounts = activeView === "reels" ? reelsStatusCounts : (products?.statusCounts || { active: 0, reviewing: 0, denied: 0, draft: 0, unsubscribed: 0 });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <ShopTopArea
        statusCounts={statusCounts}
        status={status}
        seller={products?.seller}
      />
      <Suspense key={`${page}-${activeView}-${status}`} fallback={<ProductListSkeleton />}>
        <MyShop
          statesInNigeria={statesInNigeriaData?.data || []}
          products={products.data}
          meta={products?.meta}
          isEmpty={products?.isEmpty}
          reelsGrouped={reelsData?.reels || []}
          activeView={activeView}
        />
      </Suspense>
    </div>
  );
}
