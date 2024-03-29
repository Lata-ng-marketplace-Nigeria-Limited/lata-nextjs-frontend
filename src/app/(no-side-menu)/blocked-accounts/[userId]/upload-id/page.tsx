import UploadID from "@/components/blocked-accounts/UploadID";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Upload ID",
};

const Page = () => {
  return (
    <main>
      <UploadID />
    </main>
  );
};

export default Page;
