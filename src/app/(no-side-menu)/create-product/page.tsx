import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CreateOrEditProduct } from "@components/product/CreateOrEditProduct";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create Product",
};

export default async function Page() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  if (session.role !== "SELLER") {
    redirect("/");
  }

  return (
    <div className={"w-full"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <CreateOrEditProduct />
    </div>
  );
}
