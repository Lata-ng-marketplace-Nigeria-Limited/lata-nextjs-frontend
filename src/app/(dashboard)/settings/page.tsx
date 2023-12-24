import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HeaderText from "@atom/HeaderText";
import { SettingsForm } from "@components/forms/SettingsForm";
import { authConfig } from "@authConfig";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Page() {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title>Settings</HeaderText>
      <SettingsForm image={session?.user.image as any} />
    </div>
  );
}
