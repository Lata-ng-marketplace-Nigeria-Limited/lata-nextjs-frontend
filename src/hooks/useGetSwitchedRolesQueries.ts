import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { useSearchParams } from "next/navigation";

interface Params {
  [key: string]: string | null;
}

export default function useGetSwitchedRolesQueries() {
  const searchParams = useSearchParams();
  const param = new URLSearchParams(searchParams);

  const queries: SwitchedRoleQueries = {
    role: param.get("role") || "",
    uid: param.get("uid") || "",
    sessionSwitched: param.get("sessionSwitched") || "",
  };

  return queries;
}
