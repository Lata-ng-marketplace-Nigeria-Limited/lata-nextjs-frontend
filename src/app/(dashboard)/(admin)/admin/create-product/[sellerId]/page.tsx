import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CreateOrEditProduct } from "@components/product/CreateOrEditProduct";
import { Suspense } from "react";
import { authConfig } from "@authConfig";
import { getAllStatesApi } from "@/api/location";

export const metadata: Metadata = {
  title: "Create Product",
};

export default async function Page({
  params: { sellerId },
}: {
  params: {
    sellerId: string;
  };
}) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    redirect("/auth");
  }

  if (session.role !== "ADMIN" && session.role !== "STAFF") {
    redirect("/");
  }

  const statesInNigeria = await getAllStatesApi();

  return (
    <div className={"w-full"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <CreateOrEditProduct
        sellerId={sellerId}
        statesInNigeria={statesInNigeria?.data || []}
      />
    </div>
  );
}
