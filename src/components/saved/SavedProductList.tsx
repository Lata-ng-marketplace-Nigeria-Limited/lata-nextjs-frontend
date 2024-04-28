"use client";

import { Product, SavedProduct } from "@/interface/products";
import { FetchMeta } from "@/interface/general";
import LazyLoadProducts from "@components/product/LazyLoadProducts";
import { useEffect, useState } from "react";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import Paginate from "@components/input/Paginate";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { State } from "@/interface/location";

interface Props {
  savedProducts: SavedProduct[];
  meta: FetchMeta;
  hideIsEmpty: boolean;
  statesInNigeria: State[];
}
export const SavedProductList = ({
  savedProducts,
  meta,
  hideIsEmpty,
  statesInNigeria
}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasLoadedProducts, setHasLoadedProducts] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (!savedProducts.length) {
      setHasLoadedProducts(true);
      return;
    }
    setProducts(savedProducts.map((savedProduct) => savedProduct.product));
    setHasLoadedProducts(true);
  }, [savedProducts]);

  const handlePageChange = (toPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", toPage + "");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {hasLoadedProducts ? (
        <div>
          <LazyLoadProducts
            statesInNigeria={statesInNigeria}
            products={products}
            showLimit={4}
            offset={4}
            hideFallback={hideIsEmpty}
          />

          {meta?.last_page > 1 ? (
            <>
              <div className={"mt-[1rem]"} />
              <Paginate
                meta={meta}
                onPageChange={handlePageChange}
                currentPage={Number(searchParams.get("page") || 1)}
              />
            </>
          ) : null}
        </div>
      ) : (
        <ProductListSkeleton />
      )}
    </>
  );
};
