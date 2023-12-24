"use client";

import Button from "@atom/Button";
import { HamburgerIcon } from "@atom/icons/Hamburger";
import { useSideMenuStore } from "@/store/states/sideMenuState";

export const HeaderHamburgerButton = () => {
  const { toggleIsOpen } = useSideMenuStore();

  return (
    <Button
      format={"icon"}
      onClick={() => {
        toggleIsOpen();
      }}
      className={"after:w-[120%] "}
      id={"side-menu-button"}
      aria-label={"Open side menu"}
    >
      <HamburgerIcon className={"mr-[6px] tablet:hidden "} />
    </Button>
  );
};
