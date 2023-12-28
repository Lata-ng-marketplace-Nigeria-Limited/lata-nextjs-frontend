"use client";

import Button from "@/components/atom/Button";
import { LataLogo } from "@/components/atom/icons/Lata";
import { cn } from "@/utils";
import {
  DASHBOARD_PRODUCT_CREATE_ROUTE,
  SELLER_SIGN_UP_ROUTE,
} from "@/constants/routes";
import Link from "next/link";
import { HeaderHamburgerButton } from "@molecule/HeaderHamburgerButton";
import { SearchProductForm } from "@components/forms/SearchProductForm";
import { useUser } from "@hooks/useUser";
import { useToast } from "@components/ui/use-toast";
import { ToastAction } from "@components/ui/toast";
import { useCallback } from "react";
import { useRegistrationFormStore } from "@/store/states/userState";
import { useRouter } from "next/navigation";

interface Props {
  noSideMenu?: boolean;
  recentSearches?: string[];
}

const Header = ({ recentSearches, noSideMenu }: Props) => {
  const { role, user } = useUser();
  const { toast } = useToast();
  const { setRegistrationForm } = useRegistrationFormStore();
  const { push } = useRouter();

  const handleSwitchToSeller = useCallback(() => {
    if (!user) return;
    setRegistrationForm({
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      shouldCompleteForm: true,
      isUpgradingToSeller: true,
    });
    push("/auth" + SELLER_SIGN_UP_ROUTE + "?isUpgradingToSeller=true");
  }, [push, setRegistrationForm, user]);

  return (
    <header className="bg-white z-30 sticky top-0 h-[50px] md:h-[60px] flex px-1 xs:px-2.5 sm:px-4 md:px-6  gap-x-1 justify-between items-center shadow-header">
      <div
        className={
          "flex w-full gap-x-[6px] xls:gap-x-[20px] xs:gap-x-[50px] md:gap-x-[100px] lg:gap-x-[190px] justify-between items-center"
        }
      >
        <div className={"flex items-center"}>
          {!noSideMenu ? <HeaderHamburgerButton /> : null}

          <Link href={"/"}>
            <LataLogo
              className={
                "w-[33px] h-[9px] sm:-[46px] sm:h-[13px] tablet:w-[60px] tablet:h-[20px] cursor-pointer"
              }
            />
          </Link>
        </div>

        <SearchProductForm recentSearches={recentSearches} />
      </div>

      {role === "ADMIN" ? null : (
        <Button
          type={"submit"}
          as={"link"}
          href={DASHBOARD_PRODUCT_CREATE_ROUTE}
          format={"primary"}
          onClick={(e) => {
            if (role === "BUYER") {
              e.preventDefault();

              toast({
                title: "Only sellers can sell products",
                variant: "info",
                action: (
                  <ToastAction
                    altText={"Switch to seller account"}
                    onClick={handleSwitchToSeller}
                  >
                    Become a seller
                  </ToastAction>
                ),
              });
            }
          }}
          className={cn(`
          px-[8px]
          py-[4px]
          
          sm:px-4
          sm:py-1.5
          tablet:px-6
          tablet:py-3
          text-xs
          sm:text-base     
        `)}
        >
          SELL
        </Button>
      )}
    </header>
  );
};

export default Header;
