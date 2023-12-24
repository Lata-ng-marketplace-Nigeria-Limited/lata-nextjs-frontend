import { findAProductApi } from "@/api/product";
import { ViewProductArea } from "@components/product/ViewProductArea";

interface Props {
  id: string;
}

export const ViewProduct = async ({ id }: Props) => {
  const data = await findAProductApi(id);

  return <ViewProductArea data={data} />;
};
