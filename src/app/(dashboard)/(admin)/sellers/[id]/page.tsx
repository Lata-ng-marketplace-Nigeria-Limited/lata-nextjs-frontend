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
  searchParams: Promise<{ query: string }>;
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const [params, session] = await Promise.all([props.params, getServerSession(authConfig)]);
  const { id: sellerId } = params;
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

export default async function Page(props: PageProps) {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  const { id: sellerId } = params;
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
