import { GetUser } from "@atom/GetUser";
import { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import { findAProductApi } from "@/api/product";
import { ViewProductSkeleton } from "@components/skeleton/ViewProductSkeleton";
import { Suspense } from "react";
import { ViewProduct } from "@components/product/ViewProduct";
import { unstable_noStore } from "next/cache";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.id;
  // fetch data
  const data = await findAProductApi(id);
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: data?.product.name || "Product not found",
    description: data?.product.description || "",
    openGraph: {
      images: [data?.product.files?.[0]?.url || previousImages[0]],
      title: data?.product.name,
      description: data?.product.description,
      url: `https://lata.ng/product/${id}`,
      phoneNumbers: [data?.userData?.phoneNumber || ""],
      tags: [data?.product?.category?.name || ""],
    },
  };
}

interface ISearchParms extends SwitchedRoleQueries {}

export default async function Page({
  params: { id },
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams?: ISearchParms;
}) {
  unstable_noStore();
  const queries: ISearchParms = {
    role: searchParams?.role || "",
    sessionSwitched: searchParams?.sessionSwitched || "",
    uid: searchParams?.uid || "",
  };
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <Suspense key={id} fallback={<ViewProductSkeleton />}>
        <ViewProduct id={id} queries={queries}/>
      </Suspense>
    </div>
  );
}
