import { getLegalDocsApi } from "@/api/legal";
import { LegalCard } from "@molecule/LegalCard";

export const LegalCardArea = async () => {
  const res = await getLegalDocsApi();
  return (
    <div className={"flex flex-col gap-y-6 mt-6"}>
      {res?.data?.map((doc, i) => <LegalCard doc={doc} key={i} />)}
    </div>
  );
};
