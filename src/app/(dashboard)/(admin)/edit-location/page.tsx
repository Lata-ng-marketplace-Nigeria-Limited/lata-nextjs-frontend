import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { GetUser } from "@atom/GetUser";
import Location from "@/components/admin/Location";
import { getAllStatesApi } from "@/api/location";
import CentralizedRollerSpinner from "@/components/molecule/CentralizedRollerSpinner";

export const metadata: Metadata = {
  title: "Edit Location",
};

export default async function Protected() {
  const session = await auth();
  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/");
  }

  const response = await getAllStatesApi();

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <Suspense fallback={<CentralizedRollerSpinner />}>
        <Location states={response.data} />
      </Suspense>
    </div>
  );
}
