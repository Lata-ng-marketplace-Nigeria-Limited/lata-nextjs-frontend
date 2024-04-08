import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import ProtectedSellerProfile from "@/components/admin/ProtectedSellerProfile";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
  params: { sellerId },
}: {
  params: {
    sellerId: string;
  };
  searchParams: {
    query: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (
    !session ||
    !session.user ||
    (session.role !== "ADMIN" && session.role !== "STAFF")
  ) {
    redirect("/");
  }
  const query = searchParams?.query || "";
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <ProtectedSellerProfile sellerId={sellerId} query={query} />
    </div>
  );
}
