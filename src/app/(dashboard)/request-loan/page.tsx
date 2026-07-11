import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeaderText from "@atom/HeaderText";
import HeaderSubText from "@atom/HeaderSubText";
import MobileBorderArea from "@atom/MobileBorderArea";
import { RequestLoanForm } from "@components/forms/RequestLoanForm";
import { Suspense } from "react";
import { unstable_noStore } from "next/cache";

export const metadata: Metadata = {
  title: "Request Loan",
};

export default async function Page() {
  unstable_noStore();
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
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
