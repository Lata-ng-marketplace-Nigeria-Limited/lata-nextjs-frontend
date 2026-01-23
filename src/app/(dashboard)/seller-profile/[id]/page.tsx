import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import { ViewProductSkeleton } from "@components/skeleton/ViewProductSkeleton";
import { SellerProfileWrapper } from "@components/seller-profile/SellerProfileWrapper";
import { Metadata, ResolvingMetadata } from "next";
import { getSellerProfileApi } from "@/api/auth";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pid?: string }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  // fetch data
  const { seller } = await getSellerProfileApi(id);
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

export default async function Page(props: {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ pid?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { id } = params;
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
