import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import HeaderText from "@atom/HeaderText";
import { GetUser } from "@atom/GetUser";
import AdminRevenueList from "@/components/admin/AdminRevenueList";
import { findAdminTransactionsApi } from "@/api/payment";

export const metadata: Metadata = {
  title: "Revenue & Transactions",
};

export default async function Page(props: {
  searchParams: Promise<{
    page?: string;
    type?: string;
    query?: string;
    month?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const page = searchParams?.page || "1";
  const type = searchParams?.type || "";
  const queryTerm = searchParams?.query || "";
  const month = searchParams?.month || "";

  const response = await findAdminTransactionsApi({
    page: Number(page),
    limit: 10,
    type,
    q: queryTerm,
    month,
  });

  return (
    <div className="flex flex-col gap-y-6">
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title>Revenue & Transactions</HeaderText>

      <AdminRevenueList 
        initialData={response?.transactions?.data || []}
        meta={response?.transactions?.meta}
        currentPage={Number(page)}
        currentType={type}
      />
    </div>
  );
}
