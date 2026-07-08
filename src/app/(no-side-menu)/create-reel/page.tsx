import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReelUploadForm } from "@/components/reels/ReelUploadForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create Reel",
};

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth");
  }

  if (session.role === "BUYER") {
    redirect("/");
  }

  return (
    <div className={"w-full"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <ReelUploadForm />
    </div>
  );
}
