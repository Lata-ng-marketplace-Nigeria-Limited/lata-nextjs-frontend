"use client";

import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AutoLogout = () => {
  const router = useRouter();

  useEffect(() => {
    // Check session status on each page load
    const checkSession = async () => {
      const session = await getServerSession();
      if (!session) {
        // Session expired, redirect to logout or login page
        console.log();
        router.push("/logout");
      }
    };

    checkSession();
  }, [router]);
  return <div>AutoLogout</div>;
};

export default AutoLogout;
