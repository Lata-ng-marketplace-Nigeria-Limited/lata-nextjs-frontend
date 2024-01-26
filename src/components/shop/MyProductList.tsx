"use client";

import { Product } from "@/interface/products";
import LazyLoadProducts from "@components/product/LazyLoadProducts";
import Paginate from "@components/input/Paginate";
import { FetchMeta } from "@/interface/general";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  products: Product[];
  meta: FetchMeta;
  isEmpty?: boolean;
}
export const MyProductList = ({ products, meta, isEmpty }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handlePageChange = (toPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", toPage + "");
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <>
      <LazyLoadProducts
        products={products}
        // offset={4}
        // showLimit={4}
        hideFallback={products.length > 0}
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
    </>
  );
};
