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
import Modal from "@molecule/Modal";
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
  const [showLoanModal, setShowLoanModal] = useState(false);
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

    replace(previousUrl || LANDING_ROUTE);
  };

  const renderSellButton = () => {
    return (
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
    );
  };

  const renderAuthActions = () => {
    if (!user) {
      return (
        <div className="flex items-center gap-1 sm:gap-2">
          {renderSellButton()}
          <Button
            as="link"
            href="/auth/login"
            format="secondary"
            className="px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs md:text-sm border-grey3 hover:border-primary text-grey9 bg-white shadow-sm shrink-0 font-medium rounded-lg"
          >
            Login
          </Button>
        </div>
      );
    }

    if (role === "ADMIN" && !isSwitchingRole) return null;

    if (role === "STAFF") {
      return (
        <ProfileSummary
          name={user?.name as string}
          imgSrc={user?.avatar as string}
        />
      );
    }

    return renderSellButton();
  };

  return (
    <header className="shadow-header sticky top-0 z-30 h-auto md:h-[60px] bg-white px-1 xs:px-2.5 sm:px-4 md:px-6 py-2 md:py-0 flex flex-col justify-center">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-2 md:gap-y-0 w-full">
        {/* Top Header Row (Logo, Hamburger, Sell button on Mobile) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center">
            {!noSideMenu ? <HeaderHamburgerButton /> : null}

            <Link href={"/"}>
              <LataLogo
                className={
                  "sm:-[46px] h-[9px] w-[33px] cursor-pointer sm:h-[13px] tablet:h-[20px] tablet:w-[60px]"
                }
              />
            </Link>
          </div>

          {/* Sell Button / Profile Summary (Mobile Only) */}
          <div className="flex md:hidden items-center shrink-0">
            {renderAuthActions()}
          </div>
        </div>

        {/* Search Product Form (Centered on Desktop, Full-width row below on Mobile) */}
        <div className="w-full md:flex-1 md:max-w-[400px] lg:max-w-[600px] md:mx-4">
          <SearchProductForm recentSearches={recentSearches} />
        </div>

        {/* Sell Button / Profile Summary (Desktop Only) */}
        <div className="hidden md:flex items-center shrink-0">
          {renderAuthActions()}
        </div>
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
      <Modal isShown={showLoanModal} setIsShown={setShowLoanModal}>
        <div className="p-6 text-center max-w-[360px] mx-auto bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
          {!user ? (
            // 1. Guest User
            <>
              <div className="w-12 h-12 bg-purp2 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-grey10 mb-2">Account Required</h3>
              <p className="text-xs text-grey6 leading-relaxed mb-6">
                Only signed up users can get a loan. Please sign in or create an account to view loan options.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  as="link"
                  href="/auth"
                  format="primary"
                  className="w-full py-2 text-sm font-semibold rounded-lg text-center"
                  onClick={() => setShowLoanModal(false)}
                >
                  Sign In / Sign Up
                </Button>
                <Button
                  format="secondary"
                  className="w-full py-2 text-sm font-semibold rounded-lg border-none hover:bg-grey2"
                  onClick={() => setShowLoanModal(false)}
                >
                  Close
                </Button>
              </div>
            </>
          ) : role === "BUYER" || user.role === "BUYER" ? (
            // 2. Buyer User
            <>
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-grey10 mb-2">Not Eligible Yet</h3>
              <p className="text-xs text-grey6 leading-relaxed mb-6">
                You are not qualified for a loan yet. Please maintain active purchase history and consistent payment transactions to become eligible.
              </p>
              <Button
                format="primary"
                className="w-full py-2 text-sm font-semibold rounded-lg"
                onClick={() => setShowLoanModal(false)}
              >
                Okay
              </Button>
            </>
          ) : (
            // 3. Seller / Staff / Admin User
            <>
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-grey10 mb-2">Not Eligible Yet</h3>
              <p className="text-xs text-grey6 leading-relaxed mb-6">
                You are not qualified for a loan yet. Please maintain active shop operations, subscriptions, and transaction history to become eligible.
              </p>
              <Button
                format="primary"
                className="w-full py-2 text-sm font-semibold rounded-lg"
                onClick={() => setShowLoanModal(false)}
              >
                Okay
              </Button>
            </>
          )}
        </div>
      </Modal>
    </header>
  );
};

export default Header;
