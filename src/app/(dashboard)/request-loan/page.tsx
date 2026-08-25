import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeaderText from "@atom/HeaderText";
import HeaderSubText from "@atom/HeaderSubText";
import MobileBorderArea from "@atom/MobileBorderArea";
import { RequestLoanForm } from "@components/forms/RequestLoanForm";
import { getLoansAdminApi } from "@/api/admin";
import AdminLoansList from "@/components/admin/AdminLoansList";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { unstable_noStore } from "next/cache";

export const metadata: Metadata = {
  title: "Loans",
};

export default async function Page(props: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    sessionSwitched?: string;
    uid?: string;
  }>;
}) {
  unstable_noStore();
  const searchParams = await props.searchParams;
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const search = searchParams?.q || "";
  const page = searchParams?.page || "";
  const isViewingAsAnotherUser = searchParams?.sessionSwitched && searchParams?.uid;

  if (session.role === "ADMIN" && !isViewingAsAnotherUser) {
    return (
      <div className="flex flex-col gap-y-6 px-4 py-6 sm:px-6">
        <Suspense>
          <GetUser />
        </Suspense>
        
        <div className="flex flex-col gap-y-2 border-b border-grey2 pb-4">
          <HeaderText title>Loan Requests</HeaderText>
          <p className="text-sm text-grey6">Manage and review submitted loan applications from users.</p>
        </div>

        <Suspense
          key={`${page}-${search}`}
          fallback={
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader className="w-8 h-8 animate-spin text-primary" />
              <span className="text-sm text-grey6">Loading loan requests...</span>
            </div>
          }
        >
          <AdminLoansListLoader page={page} search={search} />
        </Suspense>
      </div>
    );
  }

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <MobileBorderArea className="h-max pb-12">
        <HeaderText title>Request a Loan</HeaderText>
        <HeaderSubText>
          Submit your details to apply for a business loan. Please fill out all required fields.
        </HeaderSubText>
        <div className="mt-8">
          <RequestLoanForm />
        </div>
      </MobileBorderArea>
    </div>
  );
}

async function AdminLoansListLoader({ page, search }: { page: string; search: string }) {
  const loansData = await getLoansAdminApi({ page, search });

  return (
    <AdminLoansList
      loans={loansData?.data || []}
      meta={loansData?.meta || {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
        first_page: 1,
        first_page_url: "",
        last_page_url: "",
        next_page_url: "",
        previous_page_url: "",
      }}
      page={page}
      urlSearch={search}
    />
  );
}
