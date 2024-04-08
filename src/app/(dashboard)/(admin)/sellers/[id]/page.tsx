import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import { ViewProductSkeleton } from "@components/skeleton/ViewProductSkeleton";
import ProtectedSellerProfile from "@/components/admin/ProtectedSellerProfile";
import { getProtectedSellerApi } from "@/api/admin";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams?: { query: string };
  params: {
    sellerId: string;
  };
}

export async function generateMetadata({
  params: { sellerId },
}: PageProps): Promise<Metadata> {
  const session = await getServerSession(authConfig);
  if (
    !session ||
    !session.user ||
    (session.role !== "ADMIN" && session.role !== "STAFF")
  ) {
    redirect("/");
  }
  const response = await getProtectedSellerApi({ sellerId });

  return {
    title: response?.data?.name + " Profile",
  };
}

export default async function Page({
  searchParams,
  params: { sellerId },
}: PageProps) {
  const query = searchParams?.query || "";
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <Suspense key={sellerId} fallback={<ViewProductSkeleton />}>
        <ProtectedSellerProfile sellerId={sellerId} query={query} />
      </Suspense>
    </div>
  );
}
