import AuthFormArea from "@components/auth/AuthFormArea";
import { LoginForm } from "@components/forms/LoginForm";
import AuthImageArea from "@components/auth/AuthImageArea";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Login() {
  const session = await auth();
  if (session && session.user) {
    redirect("/");
  }
  return (
    <div className={"flex"}>
      <AuthFormArea title={"Login account"}>
        <LoginForm />
      </AuthFormArea>

      <AuthImageArea
        href={
          "https://res.cloudinary.com/dg9by7oca/image/upload/v1688142224/lata_1_l5olud.webp"
        }
      />
    </div>
  );
}
