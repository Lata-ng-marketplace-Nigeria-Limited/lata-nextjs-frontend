"use client";

import Button from "@/components/atom/Button";
import { LataLogo } from "@/components/atom/icons/Lata";
import { cn, handleSearchSwitchUrl } from "@/utils";
import {
  DASHBOARD_PRODUCT_CREATE_ROUTE,
  LANDING_ROUTE,
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getRecentSearchesApi } from "@/api/product";
import { UserRole } from "@/interface/user";
import ProfileSummary from "../staff/ProfileSummary";
import Alert from "../atom/Alert";
import { useRoleSwitchStore } from "@/store/states/localStore";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import useGetSwitchedRolesQueries from "@/hooks/useGetSwitchedRolesQueries";

interface Props {
  noSideMenu?: boolean;
  role?: UserRole;
}

const Header = ({ noSideMenu, role }: Props) => {
  const { user } = useUser();
  const { toast } = useToast();
  const { setRegistrationForm } = useRegistrationFormStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {
    setIsSwitchingRole,
    isSwitchingRole,
    setSessionUser,
    sessionUser,
    previousUrl,
    searchQuery,
  } = useRoleSwitchStore();

  const { push, replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const queries = useGetSwitchedRolesQueries();

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getRecentSearchesApi(queries);
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

  const onLeaveSession = () => {
    if (params.get("role")) {
      params.delete("role");
    }
    if (
      params.get("sessionSwitched") as SwitchedRoleQueries["sessionSwitched"]
    ) {
      params.delete("sessionSwitched");
    }
    if (params.get("uid")) {
      params.delete("uid");
    }
    setIsSwitchingRole("");
    setSessionUser(null);

    push(previousUrl || LANDING_ROUTE);
  };


  return (
    <header className="shadow-header sticky top-0 z-30  h-[50px]  bg-white px-1  xs:px-2.5 sm:px-4 md:h-[60px] md:px-6">
      <div className="flex items-center justify-between gap-x-1">
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

        {role === "ADMIN" && !isSwitchingRole ? null : role === "STAFF" ? (
          <ProfileSummary
            name={user?.name as string}
            imgSrc={user?.avatar as string}
          />
        ) : (
          <Button
            type={"submit"}
            as={"link"}
            href={handleSearchSwitchUrl(
              DASHBOARD_PRODUCT_CREATE_ROUTE,
              isSwitchingRole,
              searchQuery,
            )}
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
      </div>
      {params.get("sessionSwitched") && params.get("uid") && (
        <div className="flex justify-center">
          <Alert type="info" className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 text-white">
              <p className={""}>
                You are currently in{" "}
                {`${sessionUser?.name}'s ` || "another user's "}
                session
              </p>
              <Button format="primary" onClick={onLeaveSession}>
                Leave
              </Button>
            </div>
          </Alert>
        </div>
      )}
    </header>
  );
};

export default Header;
