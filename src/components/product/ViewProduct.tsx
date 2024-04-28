import { getAllStatesApi } from "@/api/location";
import { findAProductApi } from "@/api/product";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { ViewProductArea } from "@components/product/ViewProductArea";

interface Props {
  id: string;
  queries: SwitchedRoleQueries;
}

export const ViewProduct = async ({ id, queries }: Props) => {
  const data = await findAProductApi(id, queries);
  const allStates = await getAllStatesApi();

  return (
    <ViewProductArea data={data} statesInNigeria={allStates?.data || []} />
  );
};
