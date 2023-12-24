import { Suspense } from "react";
import HeroImage from "@/components/molecule/HeroImage";
import HomeProducts from "@components/product/HomeProducts";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { DashboardSelectCategories } from "@molecule/DashboardSelectCategories";

export const metadata = {
  title: "Buy, sell, or rent products or search for your dream job on Lata.ng",
  openGraph: {
    title: "LATA.ng",
    images: [
      {
        url: "https://res.cloudinary.com/dg9by7oca/image/upload/v1693411084/oggg_image_u5mv8f.webp",
        alt: "Buy and sell on LATA.ng",
      },
    ],
    url: "https://lata.ng",
    type: "website",
    description:
      "GET 100% VALUE WITH GUARANTY. Buy, sell, or rent vehicles of all types, Real estate, motorcycles, trucks, electronics, gadgets, home and office accessories, constructions, medicals, agric and food, fashion, buses and search for your dream job on Lata.ng.  Explore a diverse range of products and connect with a vibrant community of sellers and buyers.",
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    category?: string;
    page?: string;
  };
}) {
  // const session = await getServerSession(authConfig);
  const query = searchParams?.category || "";
  return (
    <main className="">
      <HeroImage
        src={
          "https://res.cloudinary.com/dg9by7oca/image/upload/v1690621836/gghgh_h3coii.webp"
        }
        alt={`Buy and sell products online`}
      />
      <DashboardSelectCategories />
      <Suspense key={query} fallback={<ProductListSkeleton />}>
        <HomeProducts query={query} />
      </Suspense>
    </main>
  );
}
