import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MyShop } from "@components/shop/MyShop";
import { Suspense } from "react";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { unstable_noStore } from "next/cache";
import { findAllMyProductsApi } from "@/api/product";
import ShopTopArea from "@/components/shop/ShopTopArea";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { getAllStatesApi } from "@/api/location";
import { getReelsApi } from "@/api/reels";

export const metadata: Metadata = {
  title: "My Shop",
};

interface ISearchParams extends SwitchedRoleQueries {
  page?: string;
  tab?: string;
  type?: string;
}

export default async function Page(props: {
  searchParams: Promise<ISearchParams>;
}) {
  const searchParams = await props.searchParams;
  unstable_noStore();
  const session = await auth();

  const queries: ISearchParams = {
    page: searchParams?.page || "",
    tab: searchParams?.tab || "",
    role: searchParams?.role || "",
    sessionSwitched: searchParams?.sessionSwitched || "",
    uid: searchParams?.uid || "",
  };

  const activeView = searchParams?.type === "reels" ? "reels" : "products";

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const products = await findAllMyProductsApi(queries);
  const statesInNigeriaData = await getAllStatesApi();
  const reelsData = await getReelsApi({ sellerId: session.user.id });

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
      <ShopTopArea statusCounts={statusCounts} status={queries.tab} />
      <Suspense key={`${queries.page}-${activeView}-${queries.tab}`} fallback={<ProductListSkeleton />}>
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
