import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import { ViewProductSkeleton } from "@components/skeleton/ViewProductSkeleton";
import ProtectedSellerProfile from "@/components/admin/ProtectedSellerProfile";

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
