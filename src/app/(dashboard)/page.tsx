import { Suspense } from "react";
import HeroImage from "@/components/molecule/HeroImage";
import HomeProducts from "@components/product/HomeProducts";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { DashboardSelectCategories } from "@molecule/DashboardSelectCategories";
import { auth } from "@/auth";
import GoogleOneTapWrapper from "@/components/auth/GoogleOneTapWrapper";
import AdminDashboardWrapper from "@/components/admin/AdminWrapper";
import StaffDashboard from "@/components/staff/StaffDashboard";
import HeaderText from "@/components/atom/HeaderText";
import HeaderSubText from "@/components/atom/HeaderSubText";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import CentralizedRollerSpinner from "@/components/molecule/CentralizedRollerSpinner";
import { getReelsApi } from "@/api/reels";
import { ReelsRow } from "@/components/reels/ReelsRow";

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

interface ISearchParams extends SwitchedRoleQueries {
  category?: string;
  subcategory?: string;
  page?: string;
  month?: string;
  type?: string;
  q?: string;
}

export default async function Home(props: {
  searchParams: Promise<ISearchParams>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const query = searchParams?.category || "";
  const subcategory = searchParams?.subcategory || "";
  const selectedMonth = searchParams?.month || "";
  const isViewingAsAnotherUser =
    searchParams?.sessionSwitched && searchParams?.uid;

  if (session && session?.role === "ADMIN" && !isViewingAsAnotherUser) {
    return (
      <main className="">
        <Suspense fallback={<CentralizedRollerSpinner />}>
          <AdminDashboardWrapper
            username={session?.user?.name || "Admin"}
            month={selectedMonth}
            type={searchParams?.type || "posts"}
            page={searchParams?.page || "1"}
            search={searchParams?.q || ""}
          />
        </Suspense>
      </main>
    );
  } else if (session && session?.role === "STAFF" && !isViewingAsAnotherUser) {
    return (
      <main className="">
        <Suspense fallback={<CentralizedRollerSpinner />}>
          <HeaderText title>Staff Dashboard</HeaderText>
          <HeaderSubText>Hi {session?.user?.name}, Welcome back!</HeaderSubText>
          <StaffDashboard staffId={session?.user?.id} month={selectedMonth} />
        </Suspense>
      </main>
    );
  } else {
    const reelsGrouped = await getReelsApi();

    return (
      <main className="">
        <GoogleOneTapWrapper />
        <HeroImage
          src={
            "https://res.cloudinary.com/dg9by7oca/image/upload/v1690621836/gghgh_h3coii.webp"
          }
          alt={`Buy and sell products online`}
        />
        <ReelsRow reelsGrouped={reelsGrouped?.reels || []} />
        <DashboardSelectCategories />
        <Suspense key={query} fallback={<ProductListSkeleton />}>
          <HomeProducts query={query} subcategory={subcategory} />
        </Suspense>
      </main>
    );
  }
}
