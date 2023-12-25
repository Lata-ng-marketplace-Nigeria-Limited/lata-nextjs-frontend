import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { findAProductApi } from "@/api/product";
import { Suspense } from "react";
import { CreateOrEditProduct } from "@components/product/CreateOrEditProduct";
import EditProduct from "@components/product/EditProduct";
import { authConfig } from "@authConfig";

export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function Page({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/auth");
  }

  if (session.role === "BUYER") {
    redirect("/");
  }

  const data = await findAProductApi(id);
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <Suspense key={id} fallback={<div>Loading</div>}>
        <EditProduct id={id} />
      </Suspense>
    </div>
  );
}
