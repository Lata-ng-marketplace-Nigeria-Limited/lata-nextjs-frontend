import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
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
      <ProtectedSellerProfile sellerId={sellerId} />
    </div>
  );
}
