import { Metadata } from "next";
import AuthImageArea from "@components/auth/AuthImageArea";
import { SignUpAs } from "@organism/SignUpAs";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign up as",
};

export default async function Page() {
  const session = await getServerSession(authConfig);
  if (session && session.user) {
    redirect("/");
  }
  return (
    <div className="flex">
      <SignUpAs />
      <AuthImageArea
        href={
          "https://res.cloudinary.com/dg9by7oca/image/upload/v1688302020/20230508_222349_0000-removebg-preview_1_lnzm2x.svg"
        }
        imgClass={"w-full"}
      />
    </div>
  );
}
