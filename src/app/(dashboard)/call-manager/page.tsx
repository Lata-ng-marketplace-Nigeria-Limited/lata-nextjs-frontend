import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MobileBorderArea from "@atom/MobileBorderArea";
import { cn } from "@/utils";
import HeaderText from "@atom/HeaderText";
import HeaderSubText from "@atom/HeaderSubText";
import { CallManagerButton } from "@components/call-manager/CallManagerButton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Call Manager",
};

export default async function Page() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/auth/login");
  }
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <MobileBorderArea
        showBorderInDesktop
        className={cn(`px-[37px] sm:px-[60px] py-6 w-fit h-max`)}
        removePadding
      >
        <HeaderText title>Call Manager</HeaderText>
        <HeaderSubText>
          You can call the LATA.ng manager on the number below
        </HeaderSubText>

        <CallManagerButton />
      </MobileBorderArea>
    </div>
  );
}
