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

export const metadata: Metadata = {
  title: "Saved Products",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  unstable_noStore();
  const session = await getServerSession(authConfig);
  const page = searchParams?.page || "";
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title>Saved Products</HeaderText>
      <Suspense key={page} fallback={<ProductListSkeleton />}>
        <SavedProducts page={page} />
      </Suspense>
    </div>
  );
}
