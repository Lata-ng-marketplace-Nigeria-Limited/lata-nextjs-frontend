import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import { ViewProductSkeleton } from "@components/skeleton/ViewProductSkeleton";
import ProtectedSellerProfile from "@/components/admin/ProtectedSellerProfile";
import { getProtectedSellerApi } from "@/api/admin";
import { Metadata } from "next";

interface PageProps {
  params: {
    sellerId: string;
  };
}

export async function generateMetadata({
  params: { sellerId },
}: PageProps): Promise<Metadata> {
  const response = await getProtectedSellerApi({ sellerId });

  return {
    title: response?.data?.name + " Profile",
  };
}

export default async function Page({ params: { sellerId } }: PageProps) {
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <Suspense key={sellerId} fallback={<ViewProductSkeleton />}>
        <ProtectedSellerProfile sellerId={sellerId} />
      </Suspense>
    </div>
  );
}
