import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { NotificationWrapper } from "@components/notifications/NotificationWrapper";
import { unstable_noStore } from "next/cache";
import { authConfig } from "@authConfig";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  unstable_noStore();
  const session = await getServerSession(authConfig);
  const page = searchParams?.page || "";
  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense key={page} fallback={<p>Loading..</p>}>
        <NotificationWrapper page={page} />
      </Suspense>
    </div>
  );
}
