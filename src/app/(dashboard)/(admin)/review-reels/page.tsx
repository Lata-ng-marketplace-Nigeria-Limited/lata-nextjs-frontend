import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { ReviewReelWrapper } from "@/components/review-reels/ReviewReelWrapper";
import HeaderText from "@atom/HeaderText";
import { GetUser } from "@atom/GetUser";

export const metadata: Metadata = {
  title: "Review Reels",
};

export default async function Page(props: {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const search = searchParams?.q || "";
  const page = searchParams?.page || "";

  return (
    <div className={"flex flex-col gap-y-6"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <HeaderText title>Review Reels</HeaderText>

      <Suspense fallback={<div>Loading...</div>}>
        <ReviewReelWrapper page={page} search={search} />
      </Suspense>
    </div>
  );
}
