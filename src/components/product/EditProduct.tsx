import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { findAProductApi } from "@/api/product";
import { Suspense } from "react";
import { CreateOrEditProduct } from "@components/product/CreateOrEditProduct";

export default async function EditProduct({ id }: { id: string }) {
  const data = await findAProductApi(id);
  return <CreateOrEditProduct data={data} />;
}
