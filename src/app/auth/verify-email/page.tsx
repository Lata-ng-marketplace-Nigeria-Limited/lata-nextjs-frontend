import { Metadata } from "next";
import { verifyOtpApi } from "@/actions/auth";
import { VerifyEmail } from "@organism/VerifyEmail";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function Page(props: {
  searchParams: Promise<{
    code?: string;
    email?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const code = searchParams?.code || "";
  const email = searchParams?.email || "";

  const session = await auth();
  if (session && session.user) {
    redirect("/");
  }

  if (!code || !email) {
    return <div>Invalid URL</div>;
  }

  const response = await verifyOtpApi({ token: code, emailVerification: true });
  return (
    <>
      <VerifyEmail response={response} email={email} />
    </>
  );
}
