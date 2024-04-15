import { findAProductApi } from "@/api/product";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { ViewProductArea } from "@components/product/ViewProductArea";

interface Props {
  id: string;
  queries: SwitchedRoleQueries;
}

export const ViewProduct = async ({ id, queries }: Props) => {
  const data = await findAProductApi(id, queries);

  return <ViewProductArea data={data} />;
};
