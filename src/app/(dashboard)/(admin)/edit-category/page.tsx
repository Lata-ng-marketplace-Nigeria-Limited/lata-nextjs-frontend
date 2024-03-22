import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import Category from "@/components/admin/Category";
import { fetchCategoriesApi } from "@/api/admin";

export const metadata: Metadata = {
  title: "Edit Category",
};

export default async function Protected({
  searchParams,
}: {
  searchParams: {
    page: string;
    limit: string;
    transactionStatus: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const page = searchParams?.page || "";
  const limit = searchParams?.limit || "";

  const response = await fetchCategoriesApi({ page, limit });

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Category categories={response} />
      </Suspense>
    </div>
  );
}
