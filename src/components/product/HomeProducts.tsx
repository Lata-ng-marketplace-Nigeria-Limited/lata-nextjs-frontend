import { cn } from "@/utils";
import { getDashboardProductsApi } from "@/api/product";
import LazyLoadProducts from "@components/product/LazyLoadProducts";

interface Props {
  query: string;
}
export default async function HomeProducts({ query }: Props) {
  const products = await getDashboardProductsApi(query);
  const headerClass = cn(
    `text-sm xs:text-base tablet:text-[20px] text-grey9 font-medium`,
  );
  return (
    <div
      className={cn(
        `
            flex 
            flex-col
            gap-y-4
            sm:gap-y-6
          `,
        {
          "flex-col-reverse": !!query,
        },
      )}
    >
      {products?.trendingProducts?.length ? (
        <div>
          <h2 className={headerClass}>Trending Products</h2>
          <LazyLoadProducts
            products={products.trendingProducts}
            offset={4}
            showLimit={4}
            hideFallback
          />
        </div>
      ) : (
        ""
      )}

      <div>
        <h2 className={headerClass}>Other Products</h2>
        <LazyLoadProducts
          products={products?.otherProducts || []}
          offset={4}
          showLimit={4}
          hideFallback={(products?.otherProducts?.length || 0) > 0}
        />
      </div>
    </div>
  );
}
