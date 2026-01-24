import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";

export const metadata: Metadata = {
  title: "Rider Requests",
};

export default async function Protected() {
  const session = await auth();
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <p>Rider Requests</p>
    </div>
  );
}
