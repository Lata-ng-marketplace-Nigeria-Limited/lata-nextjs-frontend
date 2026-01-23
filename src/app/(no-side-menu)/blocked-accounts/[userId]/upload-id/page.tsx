import { getBlockedUserDetailsApi } from "@/api/blocked-account";
import UploadID from "@/components/blocked-accounts/UploadID";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Upload ID",
};

const Page = async (props: {
  params: Promise<{
    userId: string;
  }>;
}) => {
  const params = await props.params;
  const { userId } = params;
  const response = await getBlockedUserDetailsApi(userId);

  if (response?.data && response?.data?.status !== "BLOCKED") {
    redirect("/");
  }

  console.log("response", response);

  return (
    <main>
      <UploadID
        userId={userId}
        appealStatus={response?.data?.appealStatus || null}
      />
    </main>
  );
};

export default Page;
