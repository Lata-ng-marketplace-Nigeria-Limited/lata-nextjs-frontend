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
import { useCallback, useEffect, useState } from "react";
import { useRegistrationFormStore } from "@/store/states/userState";
import { useRouter } from "next/navigation";
import { getRecentSearchesApi } from "@/api/product";

interface Props {
  noSideMenu?: boolean;
}

const Header = ({ noSideMenu }: Props) => {
  const { role, user } = useUser();
  const { toast } = useToast();
  const { setRegistrationForm } = useRegistrationFormStore();
  const { push } = useRouter();

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getRecentSearchesApi();
      setRecentSearches(data);
    })();
  }, []);

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
    <header className="shadow-header sticky top-0 z-30 flex h-[50px] items-center justify-between gap-x-1 bg-white px-1  xs:px-2.5 sm:px-4 md:h-[60px] md:px-6">
      <div
        className={
          "flex w-full items-center justify-between gap-x-[6px] xls:gap-x-[20px] xs:gap-x-[50px] md:gap-x-[100px] lg:gap-x-[190px]"
        }
      >
        <div className={"flex items-center"}>
          {!noSideMenu ? <HeaderHamburgerButton /> : null}

          <Link href={"/"}>
            <LataLogo
              className={
                "sm:-[46px] h-[9px] w-[33px] cursor-pointer sm:h-[13px] tablet:h-[20px] tablet:w-[60px]"
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
          
          text-xs
          sm:px-4
          sm:py-1.5
          sm:text-base
          tablet:px-6
          tablet:py-3     
        `)}
        >
          SELL
        </Button>
      )}
    </header>
  );
};

export default Header;
