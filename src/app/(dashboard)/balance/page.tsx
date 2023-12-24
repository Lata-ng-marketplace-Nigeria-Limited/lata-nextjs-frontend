import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HeaderText from "@atom/HeaderText";
import HeaderSubText from "@atom/HeaderSubText";
import MobileBorderArea from "@atom/MobileBorderArea";
import { formatPrice } from "@/utils";
import { authConfig } from "@authConfig";
import { Balance } from "@components/balance/Balance";
import { Suspense } from "react";
import { unstable_noStore } from "next/cache";

export const metadata: Metadata = {
  title: "Balance",
};

export default async function Page() {
  unstable_noStore();
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/auth/login");
  }
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <MobileBorderArea className={"h-max"}>
        <HeaderText title>My Balance</HeaderText>
        <HeaderSubText>
          You can use your balance to pay for subscription packages
        </HeaderSubText>
        <Balance balance={session?.wallet?.balance} />
      </MobileBorderArea>
    </div>
  );
}
