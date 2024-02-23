import { getProtectedSellerApi } from "@/api/admin";
import ProtectedSellerProfile from "@/components/admin/ProtectedSellerProfile";
import React from "react";

async function Page() {
  return (
    <div>
      <ProtectedSellerProfile />
    </div>
  );
}

export default Page;
