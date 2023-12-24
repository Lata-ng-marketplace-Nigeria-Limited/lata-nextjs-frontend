import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import { Suspense } from "react";
import { ReviewProductWrapper } from "@components/reveiw-products/ReviewProductWrapper";
import HeaderText from "@atom/HeaderText";
import { GetUser } from "@atom/GetUser";

export const metadata: Metadata = {
  title: "Review Products",
};

export default async function Protected({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    page?: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const search = searchParams?.q || "";
  const page = searchParams?.page || "";

  return (
    <div className={"flex flex-col gap-y-6"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title>Review Products</HeaderText>

      <Suspense fallback={<div>Loading...</div>}>
        <ReviewProductWrapper page={page} search={search} />
      </Suspense>
    </div>
  );
}
