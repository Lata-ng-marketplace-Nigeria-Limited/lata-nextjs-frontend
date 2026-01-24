import { Metadata } from "next";
import AuthFormArea from "@components/auth/AuthFormArea";
import AuthImageArea from "@components/auth/AuthImageArea";
import { redirect } from "next/navigation";
import { LOGIN_ROUTE } from "@/constants/routes";
import { SetPasswordWrapper } from "@components/forms/SetPasswordWrapper";
import { Suspense } from "react";
import { SetPasswordSkeleton } from "@components/skeleton/SetPasswordSkeleton";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Terms and Conditions",
};

export default async function Page(props: {
  searchParams: Promise<{
    code?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const code = searchParams?.code || "";
  const session = await auth();
  if (session && session.user) {
    redirect("/");
  }
  if (!code) {
    redirect("/auth" + LOGIN_ROUTE);
  }

  return (
    <div className={"flex"}>
      <AuthFormArea title={"Set new password"}>
        <Suspense fallback={<SetPasswordSkeleton />}>
          <SetPasswordWrapper code={code} />
        </Suspense>
      </AuthFormArea>
      <AuthImageArea
        href={
          "https://res.cloudinary.com/dg9by7oca/image/upload/v1688142224/lata_1_l5olud.webp"
        }
      />
    </div>
  );
}
