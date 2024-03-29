import UploadID from "@/components/blocked-accounts/UploadID";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Upload ID",
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
      <UploadID userId={userId} />
    </main>
  );
};

export default Page;
