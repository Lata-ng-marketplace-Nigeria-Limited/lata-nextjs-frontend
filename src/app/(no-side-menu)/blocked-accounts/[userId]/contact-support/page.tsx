import ContactSupport from "@/components/blocked-accounts/ContactSupport";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Contact Support",
};

const Page = () => {
  return (
    <main>
      <ContactSupport />
    </main>
  );
};

export default Page;
