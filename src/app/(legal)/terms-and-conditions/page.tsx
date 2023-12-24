import { Metadata } from "next";
import { getALegalDocApi } from "@/api/legal";
import "@styles/tiptap.scss";

export const metadata: Metadata = {
  title: "Terms and Conditions",
};

export default async function Page() {
  // const hh = await new Promise((resolve) => setTimeout(resolve, 5000));
  const doc = await getALegalDocApi({ name: "terms and conditions" });
  return (
    <div className={"flex flex-col gap-y-4"}>
      <div
        className={"tiptap"}
        dangerouslySetInnerHTML={{ __html: doc?.html || "" }}
      />
    </div>
  );
}
