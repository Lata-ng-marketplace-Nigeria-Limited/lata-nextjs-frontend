import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import { fetchAllBlockedAccountsApi } from "@/api/admin";
import BlockedAccountsDisplay from "@/components/admin/BlockedAccountsDisplay";

export const metadata: Metadata = {
  title: "Blocked Accounts",
};

export default async function Protected({
  searchParams,
}: {
  searchParams: {
    page: string;
    limit: string;
    tab: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const queries = {
    page: searchParams?.page || "",
    limit: searchParams?.limit || "",
    tab: searchParams?.tab || "",
  };

  const response = await fetchAllBlockedAccountsApi(queries);

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <BlockedAccountsDisplay
        meta={response?.meta}
        blockedAccounts={response?.data}
      />
    </div>
  );
}
