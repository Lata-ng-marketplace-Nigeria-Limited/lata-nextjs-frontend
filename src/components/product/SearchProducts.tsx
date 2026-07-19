import { searchProductsApi, getDashboardProductsApi } from "@/api/product";
import LazyLoadProducts from "@components/product/LazyLoadProducts";
import Paginate from "@components/input/Paginate";
import { State } from "@/interface/location";

interface Props {
  search: string;
  location?: string;
  page: string;
  token?: string;
  statesInNigeria: State[]
}

export const SearchProducts = async ({
  search,
  page,
  location,
  token,
  statesInNigeria
}: Props) => {
  let res = await searchProductsApi({
    search,
    page,
    token,
    ...(location && { state: location }),
    limit: "20",
  });

  let isFallback = false;
  let suggestionProducts: any[] = [];

  if (location && location !== "any" && (!res || !res.data || res.data.length === 0)) {
    const fallbackRes = await searchProductsApi({
      search,
      page,
      token,
      limit: "20",
    });
    if (fallbackRes && fallbackRes.data && fallbackRes.data.length > 0) {
      res = fallbackRes;
      isFallback = true;
    }
  }

  if (!res || !res.data || res.data.length === 0) {
    const dashProducts = await getDashboardProductsApi();
    if (dashProducts) {
      suggestionProducts = [
        ...(dashProducts.trendingProducts || []),
        ...(dashProducts.otherProducts || []),
      ].slice(0, 12);
    }
  }

  return (
    <div>
      {isFallback && (
        <p className="text-grey7 text-xs md:text-sm w-full mb-6 font-medium">
          No products found matching &quot;{search}&quot; in {location}. Here are some available in other locations:
        </p>
      )}

      {res === null || res.data.length === 0 ? (
        <div>
          <p className={"text-grey7 text-xs md:text-sm w-full mb-6 font-medium"}>
            No products found matching &quot;{search}&quot;. Here are some other products you might like:
          </p>
          {suggestionProducts.length > 0 ? (
            <LazyLoadProducts
              statesInNigeria={statesInNigeria}
              products={suggestionProducts}
              offset={4}
              showLimit={4}
              hideFallback={true}
              skeletonLength={12}
            />
          ) : (
            <p className={"text-grey5 text-xs"}>No suggestion products available.</p>
          )}
        </div>
      ) : (
        <div>
          <LazyLoadProducts
            statesInNigeria={statesInNigeria}
            products={res.data || []}
            offset={4}
            showLimit={4}
            hideFallback={(res?.data?.length || 0) > 0}
            skeletonLength={12}
          />
        </div>
      )}

      {res?.meta && res?.meta?.last_page > 1 && !suggestionProducts.length ? (
        <>
          <div className={"mt-[1rem]"} />
          <Paginate meta={res?.meta} currentPage={Number(page || 1)} />
        </>
      ) : null}
    </div>
  );
};
