import { Metadata } from "next";
import { getALegalDocApi } from "@/api/legal";
import "@styles/tiptap.scss";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default async function Page() {
  const doc = await getALegalDocApi({ name: "privacy policy" });
  return (
    <div className={"flex flex-col gap-y-4"}>
      <div
        className={"tiptap"}
        dangerouslySetInnerHTML={{ __html: doc?.html || "" }}
      />
    </div>
  );
}
