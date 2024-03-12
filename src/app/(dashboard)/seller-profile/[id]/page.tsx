import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import { ViewProductSkeleton } from "@components/skeleton/ViewProductSkeleton";
import { SellerProfileWrapper } from "@components/seller-profile/SellerProfileWrapper";
import { Metadata, ResolvingMetadata } from "next";
import { getSellerProfileApi } from "@/api/auth";

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
  const { seller, message } = await getSellerProfileApi(id);
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: seller?.name || "Seller not found",
    description: seller?.aboutBusiness || "",
    openGraph: {
      images: [
        seller?.avatar ||
          "https://res.cloudinary.com/dg9by7oca/image/upload/v1693411084/oggg_image_u5mv8f.webp",
      ],
      title: seller?.name,
      description: seller?.aboutBusiness,
      url: `https://lata.ng/seller-profile/${id}`,
      phoneNumbers: [seller?.phoneNumber || ""],
    },
  };
}

export default async function Page({
  params: { id },
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams: { pid?: string };
}) {
  const productId = searchParams.pid || "";
  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>

      <Suspense key={id} fallback={<ViewProductSkeleton />}>
        <SellerProfileWrapper id={id} productId={productId} />
      </Suspense>
    </div>
  );
}
