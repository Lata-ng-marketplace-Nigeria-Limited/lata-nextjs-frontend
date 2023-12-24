import { searchProductsApi } from "@/api/product";
import LazyLoadProducts from "@components/product/LazyLoadProducts";
import Paginate from "@components/input/Paginate";

interface Props {
  search: string;
  location?: string;
  page: string;
  token?: string;
}

export const SearchProducts = async ({
  search,
  page,
  location,
  token,
}: Props) => {
  const res = await searchProductsApi({
    search,
    page,
    token,
    ...(location && { location }),
    limit: "20",
  });

  return (
    <div>
      {res === null ? (
        <p className={"text-grey7 text-xs md:text-sm w-full"}>
          No products found
        </p>
      ) : (
        <div>
          <LazyLoadProducts
            products={res.data || []}
            offset={4}
            showLimit={4}
            hideFallback={(res?.data?.length || 0) > 0}
            skeletonLength={12}
          />
        </div>
      )}

      {res?.meta && res?.meta?.last_page > 1 ? (
        <>
          <div className={"mt-[1rem]"} />
          <Paginate meta={res?.meta} currentPage={Number(page || 1)} />
        </>
      ) : null}
    </div>
  );
};
