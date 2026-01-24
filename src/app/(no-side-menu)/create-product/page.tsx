import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreateOrEditProduct } from "@components/product/CreateOrEditProduct";
import { Suspense } from "react";
import { getAllStatesApi } from "@/api/location";

export const metadata: Metadata = {
  title: "Create Product",
};

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth");
  }

  if (session.role === "BUYER") {
    redirect("/");
  }
  const statesInNigeria = await getAllStatesApi();

  return (
    <div className={"w-full"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <CreateOrEditProduct statesInNigeria={statesInNigeria?.data || []} />
    </div>
  );
}
