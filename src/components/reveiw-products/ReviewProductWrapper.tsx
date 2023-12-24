import { getNewProductsApi } from "@/api/product";
import { ReviewProduct } from "@components/reveiw-products/ReviewProduct";

interface Props {
  page: string;
  search: string;
}

export const ReviewProductWrapper = async ({ search, page }: Props) => {
  const { data, meta } = await getNewProductsApi({
    page,
    search,
  });

  return (
    <ReviewProduct products={data} meta={meta} page={page} urlSearch={search} />
  );
};
