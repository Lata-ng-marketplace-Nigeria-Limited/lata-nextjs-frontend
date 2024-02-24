import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import { ViewProductSkeleton } from "@components/skeleton/ViewProductSkeleton";
import { SellerProfileWrapper } from "@components/seller-profile/SellerProfileWrapper";
import { Metadata, ResolvingMetadata } from "next";
import { getSellerProfileApi } from "@/api/auth";
import ProtectedSellerProfile from "@/components/admin/ProtectedSellerProfile";
import { getProtectedSellerApi } from "@/api/admin";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({
  params: { sellerId },
}: {
  params: {
    sellerId: string;
  };
}) {
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
