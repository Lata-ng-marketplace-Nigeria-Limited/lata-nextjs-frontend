import { Metadata } from "next";
import { getReelsApi, getInActiveReelsApi, getReelsStatsApi } from "@/api/reels";
import { ReelsPagePlayer } from "@/components/reels/ReelsPagePlayer";
import { ReviewReel } from "@/components/review-reels/ReviewReel";
import BadgeWithCount from "@/components/atom/BadgeWithCount";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { auth } from "@/auth";
import HeaderText from "@atom/HeaderText";
import { GetUser } from "@atom/GetUser";

export const metadata: Metadata = {
  title: "Lata Reels",
  description: "Watch latest reels from sellers at Lata.",
};

export default async function Page(props: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    tab?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  
  const search = searchParams?.q || "";
  const page = searchParams?.page || "";
  const tab = searchParams?.tab || "ACTIVE";

  if (session && session.user && session.role === "ADMIN") {
    return (
      <div className={"flex flex-col gap-y-6 px-4 py-6 sm:px-6"}>
        <Suspense>
          <GetUser />
        </Suspense>

        <Suspense
          key={`${page}-${search}-${tab}`}
          fallback={
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader className="w-8 h-8 animate-spin text-primary" />
              <span className="text-sm text-grey6">Loading reels dashboard...</span>
            </div>
          }
        >
          <AdminReelsLoader page={page} search={search} tab={tab} />
        </Suspense>
      </div>
    );
  }

  // Normal User View: vertical scrolling reel player
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-black overflow-hidden flex items-center justify-center relative">
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-white gap-2">
            <Loader className="w-6 h-6 animate-spin text-primary" />
            <span>Loading Reels...</span>
          </div>
        }
      >
        <UserReelsPlayerLoader />
      </Suspense>
    </div>
  );
}

async function AdminReelsLoader({ page, search, tab }: { page: string; search: string; tab: string }) {
  const [reelsData, reelsStats] = await Promise.all([
    getInActiveReelsApi({
      page,
      search,
      status: tab === "ALL" ? undefined : tab,
      all: tab === "ALL" ? "true" : undefined,
    }),
    getReelsStatsApi(),
  ]);

  const statsFallback = reelsStats || {
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
  };

  return (
    <>
      <div className="flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-between border-b border-grey2 pb-4">
        <div className="flex flex-col gap-y-1">
          <HeaderText title>Manage All Reels</HeaderText>
          <p className="text-sm text-grey6">Manage uploaded reels, status settings, and users.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <BadgeWithCount
            count={statsFallback.total}
            variant="normal"
            text="Total"
            query="ALL"
          />
          <BadgeWithCount
            count={statsFallback.active}
            variant="primary"
            text="Active"
            query="ACTIVE"
            isDefaultActive
          />
          <BadgeWithCount
            count={statsFallback.pending}
            variant="warning"
            text="Pending Review"
            query="INACTIVE"
          />
          <BadgeWithCount
            count={statsFallback.rejected}
            variant="danger"
            text="Rejected"
            query="CANCELLED"
          />
        </div>
      </div>

      <ReviewReel
        reels={reelsData?.data || []}
        meta={reelsData?.meta}
        page={page}
        urlSearch={search}
        hideActions={true}
      />
    </>
  );
}

async function UserReelsPlayerLoader() {
  const reelsData = await getReelsApi();
  return <ReelsPagePlayer reelsGrouped={reelsData?.reels || []} />;
}
