import { Metadata } from "next";
import AuthFormArea from "@components/auth/AuthFormArea";
import { SellerSignUpForm } from "@components/forms/SellerSignUpForm";
import AuthImageArea from "@components/auth/AuthImageArea";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Seller Sign Up",
};

interface Props {
  searchParams?: {
    isUpgradingToSeller?: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const session = await getServerSession();
  const isUpgradingToSeller = searchParams?.isUpgradingToSeller === "true";
  if (session && session.user && !isUpgradingToSeller) {
    redirect("/");
  }
  return (
    <div className={"flex"}>
      <AuthFormArea title={"Create an account"}>
        <SellerSignUpForm />
      </AuthFormArea>

      <AuthImageArea
        href={
          "https://res.cloudinary.com/dg9by7oca/image/upload/v1688302020/20230508_222349_0000-removebg-preview_1_lnzm2x.svg"
        }
        imgClass={"w-full"}
      />
    </div>
  );
}
