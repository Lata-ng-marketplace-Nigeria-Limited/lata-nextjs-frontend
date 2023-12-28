import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Button from "@atom/Button";
import { signOut } from "next-auth/react";
import { LogoutArea } from "@organism/LogoutArea";
import { Switch } from "@components/ui/switch";
import HeaderText from "@atom/HeaderText";
import { Toggle } from "@molecule/Toggle";
import { LOGIN_ROUTE } from "@/constants/routes";
import { cn } from "@/utils";
import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import { unstable_noStore } from "next/cache";
import { authConfig } from "@authConfig";

export const metadata: Metadata = {
  title: "Logout",
};

export default async function Page() {
  unstable_noStore();
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/");
  }
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title className={"mb-[1.5rem] tablet:mb-[2rem]"}>
        Logout
      </HeaderText>

      <LogoutArea />
    </div>
  );
}
