"use client";

import { signOut } from "next-auth/react";
import { useUser } from "@/hooks/useUser";
import { clearAllCookies, deleteCookies } from "@/utils";
import { Toggle } from "@molecule/Toggle";
import { LOGIN_ROUTE } from "@/constants/routes";
import { useState } from "react";

export const LogoutArea = () => {
  const { clear } = useUser();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    if (loading) return;
    try {
      localStorage.clear();
      sessionStorage.clear();
      clearAllCookies();
      clear();
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Toggle
        label={"Toggle off the button to logout your Lata.ng account"}
        labelClass={" text-grey7"}
        checked={true}
        onChange={handleLogout}
        wrapperClass={"sm:flex-col sm:items-start gap-y-2"}
        disabled={loading}
      />
    </div>
  );
};
