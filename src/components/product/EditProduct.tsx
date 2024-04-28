import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { findAProductApi } from "@/api/product";
import { Suspense } from "react";
import { CreateOrEditProduct } from "@components/product/CreateOrEditProduct";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { getAllStatesApi } from "@/api/location";

interface Props {
  id: string;
  queries: SwitchedRoleQueries;
}

export default async function EditProduct({ id, queries }: Props) {
  const data = await findAProductApi(id, queries);
  const statesInNigeria = await getAllStatesApi();

  return (
    <CreateOrEditProduct
      data={data}
      statesInNigeria={statesInNigeria?.data || []}
    />
  );
}
