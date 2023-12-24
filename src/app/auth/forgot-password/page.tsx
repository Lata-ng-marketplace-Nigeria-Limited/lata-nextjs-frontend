import { Metadata } from "next";
import AuthFormArea from "@components/auth/AuthFormArea";
import AuthImageArea from "@components/auth/AuthImageArea";
import { ForgotPasswordForm } from "@components/forms/ForgotPasswordForm";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default async function Page() {
  const session = await getServerSession(authConfig);
  if (session && session.user) {
    redirect("/");
  }
  return (
    <div className={"sm:flex md:flex lg:flex mx-auto"}>
      <AuthFormArea title={"Forgot Password?"}>
        <ForgotPasswordForm />
      </AuthFormArea>
      <AuthImageArea
        href={
          "https://res.cloudinary.com/dg9by7oca/image/upload/v1688142224/lata_1_l5olud.webp"
        }
        imgClass={"w-full"}
      />
    </div>
  );
}
