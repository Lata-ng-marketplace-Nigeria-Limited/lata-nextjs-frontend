import BlockedAccountHome from "@/components/blocked-accounts/BlockedUserHome";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Blocked Account",
};

const Page = async (props: {
  params: Promise<{
    userId: string;
  }>;
}) => {
  const params = await props.params;
  const { userId } = params;
  return (
    <main>
      <BlockedAccountHome userId={userId} />
    </main>
  );
};

export default Page;
