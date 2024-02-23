import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import { ViewProductSkeleton } from "@components/skeleton/ViewProductSkeleton";
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
      <ProtectedSellerProfile sellerId={sellerId} />
    </div>
  );
}
