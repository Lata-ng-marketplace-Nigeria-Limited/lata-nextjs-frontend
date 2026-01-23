import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import ProtectedSellerProfile from "@/components/admin/ProtectedSellerProfile";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{
    sellerId: string;
  }>;
  searchParams: Promise<{
    query: string;
  }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sellerId } = params;
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
