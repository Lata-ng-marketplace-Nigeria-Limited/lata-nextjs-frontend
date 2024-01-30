import { findAProductApi } from "@/api/product";
import { ViewProductArea } from "@components/product/ViewProductArea";
import FeedbacksForProduct from "../feedback/FeedbacksForProduct";

interface Props {
  id: string;
}

export const ViewProduct = async ({ id }: Props) => {
  const data = await findAProductApi(id);

  return (
    <>
      <ViewProductArea data={data} />
      <div className="mt-8">
        {data?.product  ? (
          <FeedbacksForProduct product={data.product} isOwnProduct={data?.isOwner}/>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
