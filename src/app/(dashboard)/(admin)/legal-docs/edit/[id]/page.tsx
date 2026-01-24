import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getALegalDocApi } from "@/api/legal";
import { EditorArea } from "@components/input/EditorArea";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function Page(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const params = await props.params;
  const { id } = params;
  const session = await auth();
  const doc = await getALegalDocApi({ id });

  if (!session || !session.user || session.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <div>
      <Suspense>
        <GetUser />
      </Suspense>
      <EditorArea id={doc?.id} html={doc?.html} json={doc?.json} />
    </div>
  );
}
