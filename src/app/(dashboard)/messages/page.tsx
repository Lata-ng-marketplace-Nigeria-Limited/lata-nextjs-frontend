import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MessagesArea } from "@components/message/MessagesArea";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function Page() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/auth/login");
  }
  return (
    <div
      className={
        "h-full min-h-[calc(100vh-50px-200px)] md:min-h-[calc(100vh-60px-200px)]"
      }
    >
      <Suspense>
        <GetUser />
      </Suspense>
      <MessagesArea />
    </div>
  );
}
