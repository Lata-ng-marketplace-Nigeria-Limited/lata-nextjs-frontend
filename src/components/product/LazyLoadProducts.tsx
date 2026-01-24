"use client";

import { Product } from "@/interface/products";
import GoogleAdsCard from "./GoogleAdsCard";
import ProductCard from "@components/product/ProductCard";
import { cn, formatPrice } from "@/utils";
import ProductGridList from "@atom/ProductGridList";
import React, { useEffect, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { selectedCity, selectedState } from "@/utils/location";
import { State } from "@/interface/location";
import RollerSpinner from "@/components/molecule/RollerSpinner";

interface Props {
  products: Product[];
  showLimit?: number;
  offset?: number;
  fallbackText?: string;
  onUnSave?: (productId: string) => void;
  hideFallback?: boolean;
  skeletonLength?: number;
  statesInNigeria: State[];
  adIndex?: number;
  adInterval?: number;
  isInfinite?: boolean;
  loadMoreAction?: (page: number) => Promise<{ data: Product[]; hasMore: boolean }>;
}

export default function LazyLoadProducts(props: Props) {
  const [offset, setOffset] = useState(12);
  const [showingProducts, setShowingProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, isIntersecting } = useIntersectionObserver({ 
    threshold: 0,
    rootMargin: '800px 0px', // Start loading when 800px away from trigger
  });
  const isVisible = isIntersecting;

  useEffect(() => {
    if (!isVisible || loading) return;

    if (offset < (props.products?.length || 0)) {
      const nextTenProducts = props.products?.slice(
        offset,
        offset + props?.showLimit!,
      );
      setOffset((prev) => prev + props?.showLimit!);
      setShowingProducts((prev) => [...prev, ...nextTenProducts]);
      return;
    }

    if (props.isInfinite && props.loadMoreAction && hasMore) {
      setLoading(true);
      props.loadMoreAction(currentPage + 1).then((res) => {
        setShowingProducts((prev) => [...prev, ...res.data]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(res.hasMore);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [isVisible, props?.products, offset, props?.showLimit, props.isInfinite, props.loadMoreAction, currentPage, loading, hasMore]);

  useEffect(() => {
    setOffset(props.offset || 12);
    setShowingProducts((props.products || [])?.slice(0, props?.showLimit));
    setCurrentPage(1);
    setHasMore(true);
  }, [props?.offset, props?.showLimit, props?.products]);

  return (
    <ProductGridList
      total={showingProducts?.length}
      isEmpty={showingProducts.length === 0}
      className={"relative"}
    >
      {showingProducts.length ? (
        showingProducts.map((product, index) => (
          <React.Fragment key={product.id + index}>
            {props.adIndex === index ||
              (props.adInterval && index > 0 && index % props.adInterval === 0) ? (
              <GoogleAdsCard key={`google-ads-card-${index}`} />
            ) : null}
            <ProductCard
              price={formatPrice(product?.price)}
              productName={product?.name}
              description={product?.description}
              state={selectedCity(
                props.statesInNigeria,
                product?.state,
                product?.city,
              )}
              city={selectedCity(
                props.statesInNigeria,
                product?.state,
                product?.city,
              )}
              imageSrc={product?.files?.[0]?.url}
              product={product}
              trending
              onUnSave={props.onUnSave}
              createProductPreview={false}
              key={product.id}
            />
          </React.Fragment>
        ))
      ) : props.hideFallback ? (
        <ProductListSkeleton length={props.skeletonLength || 4} />
      ) : (
        <div className={"w-full text-xs text-grey7 md:text-sm"}>
          {props?.fallbackText || "No products found"}
        </div>
      )}

      {loading && (
        <div className="col-span-full flex justify-center py-8">
          <RollerSpinner />
        </div>
      )}

      {(props.isInfinite ? hasMore : props?.products?.length > showingProducts?.length) ? (
        <div
          ref={ref}
          className={cn(`
          absolute 
          bottom-[0rem] 
          h-[120%]
          w-full
          bg-transparent
        `)}
        ></div>
      ) : null}
    </ProductGridList>
  );
}
