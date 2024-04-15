"use client";

import NavLink from "@/components/molecule/NavLink";
import { sideMenu } from "@/store/data/sideMenu";
import { clickOutside, cn } from "@/utils";
import { useSideMenuStore } from "@/store/states/sideMenuState";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { UserRole } from "@/interface/user";
import { useSearchParams } from "next/navigation";
import { useRoleSwitchStore } from "@/store/states/localStore";

interface SideMenuProps {
  role?: UserRole;
  isLoggedIn?: boolean;
}

const SideMenu = ({ isLoggedIn, role }: SideMenuProps) => {
  const { isOpen, setIsOpen } = useSideMenuStore();
  const ref = useRef<HTMLElement>(null);

  const [adminIsInUserMode, setAdminIsInUserMode] = useState(false);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const { isSwitchingRole, searchQuery } = useRoleSwitchStore();

  const handleSearchSwitchUrl = (url: string) => {
    if (isSwitchingRole) {
      return `${url}?${searchQuery}`;
    }
    return url;
  };

  useLayoutEffect(() => {
    if (!(role === "ADMIN" || role === "STAFF")) return;

    const session = params.get("sessionSwitched");
    const userId = params.get("uid");

    if (session && userId) {
      setAdminIsInUserMode(true);
    } else {
      setAdminIsInUserMode(false);
    }
  }, [params]);

  useEffect(() => {
    if (!ref.current) return;
    clickOutside(ref.current, (e) => {
      if (e?.target?.id === "side-menu-button" || !isOpen) return;
      setIsOpen(false);
    });
  }, [ref, isOpen, setIsOpen]);

  return (
    <aside
      ref={ref}
      className={cn(
        `
          fixed
          top-[50px] 
          z-50 
          h-max 
          max-h-[calc(100vh-50px)]
          min-h-[calc(100vh-50px)]
          w-max
          shrink-0
          -translate-x-[100%]
          overflow-auto
          border-b
          border-r
          border-grey1
          bg-white
          py-1.5
          opacity-0
          transition-transform
          tablet:sticky
          tablet:top-[60px]
          tablet:z-0
          
          tablet:max-h-full
          tablet:min-h-[calc(100vh-60px)]
          tablet:w-[200px]
          tablet:translate-x-0
          tablet:py-6
          tablet:opacity-100
          xl:w-[230px]
        `,
        {
          "translate-x-0 opacity-100": isOpen,
        },
      )}
    >
      <nav className={"left-0 top-0  grid gap-y-1.5 "}>
        {/*{!userData.loading ? (*/}
        <>
          {sideMenu.map((item, i) => {
            if (item.isSeller && role !== "SELLER" && !adminIsInUserMode)
              return;
            if (item.isAdmin && (role !== "ADMIN" || adminIsInUserMode)) return;
            if (item.isAuth && !isLoggedIn) return;
            if (item.isStaff && role !== "STAFF" && adminIsInUserMode) return;
            if (item.hideFromAdmin && role === "ADMIN" && !adminIsInUserMode)
              return;
            if (item.hideFromStaff && role === "STAFF" && !adminIsInUserMode)
              return;

            return (
              <NavLink
                key={i}
                href={handleSearchSwitchUrl(item.href)}
                icon={item.icon}
                fill={item.fill}
              >
                {item.title}
              </NavLink>
            );
          })}
        </>
        {/*) : (*/}
        {/*  ""*/}
        {/*)}*/}
      </nav>
    </aside>
  );
};

export default SideMenu;
