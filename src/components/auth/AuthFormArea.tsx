"use client";

import React from "react";
import { cn } from "@/utils";
import { LataLogo } from "@atom/icons/Lata";
import Hr from "@atom/Hr";
import {
  LEGAL_PRIVACY_POLICY_ROUTE,
  LEGAL_TERMS_AND_CONDITIONS_ROUTE,
  SELLER_SIGN_UP_ROUTE,
} from "@/constants/routes";
import AuthParagraph from "@atom/AuthParagraph";
import ALink from "@atom/ALink";
import GoogleButton from "@components/auth/GoogleButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRegistrationFormStore } from "@/store/states/userState";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
  title: string;
}
export default function AuthFormArea(props: Props) {
  const { shouldCompleteForm, isUpgradingToSeller } =
    useRegistrationFormStore();
  const pathname = usePathname();

  const sellerSignUpPagePath = "/auth" + SELLER_SIGN_UP_ROUTE;
  const hideGoogleButton =
    shouldCompleteForm && pathname === sellerSignUpPagePath;

  const sellerSignUpPageTitle =
    pathname === sellerSignUpPagePath
      ? shouldCompleteForm && !isUpgradingToSeller
        ? "Complete your profile"
        : shouldCompleteForm && isUpgradingToSeller
          ? "Upgrade to seller"
          : ""
      : "";

  return (
    <section
      className={cn(
        `
        w-full 
        px-6 
        pt-[60px] 
        pb-[22px] 
        md:px-[40px] 
        lg:px-[80px] 
        flex 
        flex-col 
        gap-y-6
        max-h-screen
        overflow-auto    
        `,
      )}
    >
      <LataLogo />
      <h1 className="text-xl font-medium text-grey9 md:text-[32px] sm:font-semibold">
        {sellerSignUpPageTitle || props.title}
      </h1>

      {props.children}

      {hideGoogleButton ? null : (
        <div className={"flex items-center sm:hidden"}>
          <Hr />
          <span className={"shrink-0 px-2.5 text-xs text-grey6"}>
            Or login with
          </span>
          <Hr />
        </div>
      )}

      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        {hideGoogleButton ? null : (
          <GoogleButton className={"py-2.5 border-grey5"} />
        )}
      </GoogleOAuthProvider>

      <AuthParagraph>
        {shouldCompleteForm && isUpgradingToSeller
          ? "Please review our"
          : "By creating an account, you agree to the"}{" "}
        <ALink target={"_blank"} href={LEGAL_TERMS_AND_CONDITIONS_ROUTE}>
          Terms and Conditions
        </ALink>{" "}
        and{" "}
        <ALink target={"_blank"} href={LEGAL_PRIVACY_POLICY_ROUTE}>
          {" "}
          Privacy Policy
        </ALink>
      </AuthParagraph>
    </section>
  );
}
