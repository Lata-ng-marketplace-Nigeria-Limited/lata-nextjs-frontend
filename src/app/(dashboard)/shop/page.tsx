import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HeaderText from "@atom/HeaderText";
import { MyShop } from "@components/shop/MyShop";
import { Suspense } from "react";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { unstable_noStore } from "next/cache";

export const metadata: Metadata = {
  title: "My Shop",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  unstable_noStore();
  const session = await getServerSession();
  const page = searchParams?.page || "";

  if (!session || !session.user) {
    redirect("/auth/login");
  }
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title>My Shop</HeaderText>
      <Suspense key={page} fallback={<ProductListSkeleton />}>
        <MyShop page={page} />
      </Suspense>
    </div>
  );
}
