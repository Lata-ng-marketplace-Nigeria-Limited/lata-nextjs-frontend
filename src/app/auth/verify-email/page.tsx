import { Metadata } from "next";
import { verifyOtpApi } from "@/actions/auth";
import { VerifyEmail } from "@organism/VerifyEmail";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@authConfig";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    code?: string;
    email?: string;
  };
}) {
  const code = searchParams?.code || "";
  const email = searchParams?.email || "";

  const session = await getServerSession(authConfig);
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
