"use client";

import NavLink from "@/components/molecule/NavLink";
import { sideMenu } from "@/store/data/sideMenu";
import { clickOutside, cn } from "@/utils";
import { useSideMenuStore } from "@/store/states/sideMenuState";
import { useEffect, useRef } from "react";
import { UserRole } from "@/interface/user";

interface SideMenuProps {
  role?: UserRole;
  isLoggedIn?: boolean;
}

const SideMenu = ({ isLoggedIn, role }: SideMenuProps) => {
  const { isOpen, setIsOpen } = useSideMenuStore();
  const ref = useRef<HTMLElement>(null);

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
          bg-white
          w-max 
          h-max 
          overflow-auto 
          fixed
          py-1.5
          tablet:sticky
          tablet:py-6
          min-h-[calc(100vh-50px)]
          max-h-[calc(100vh-50px)]
          tablet:max-h-full
          tablet:min-h-full
          tablet:min-h-[calc(100vh-60px)]
          -translate-x-[100%]
          opacity-0
          tablet:translate-x-0
          tablet:opacity-100
          transition-transform
          z-50
          tablet:z-0
          
          top-[50px]
          tablet:top-[60px]
          border-r 
          border-b
          border-grey1
          tablet:w-[200px]
          xl:w-[230px]
          shrink-0
        `,
        {
          "translate-x-0 opacity-100": isOpen,
        },
      )}
    >
      <nav className={"grid gap-y-1.5  top-0 left-0 "}>
        {/*{!userData.loading ? (*/}
        <>
          {sideMenu.map((item, i) => {
            if (item.isSeller && role !== "SELLER") return;
            if (item.isAdmin && role !== "ADMIN") return;
            if (item.isAuth && !isLoggedIn) return;
            if (item.isStaff && role !== "STAFF") return;
            if (item.hideFromAdmin && role === "ADMIN") return;
            if (item.hideFromStaff && role === "STAFF") return;

            return (
              <NavLink
                key={i}
                href={item.href}
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
