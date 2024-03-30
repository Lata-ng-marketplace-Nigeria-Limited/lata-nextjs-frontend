import BlockedAccountHome from "@/components/blocked-accounts/BlockedUserHome";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Blocked Account",
};

const Page = ({
  params: { userId },
}: {
  params: {
    userId: string;
  };
}) => {
  return (
    <main>
      <BlockedAccountHome userId={userId} />
    </main>
  );
};

export default Page;
