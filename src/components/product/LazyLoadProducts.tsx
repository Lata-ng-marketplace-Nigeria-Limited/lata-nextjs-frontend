"use client";

import { Product } from "@/interface/products";
import ProductCard from "@components/product/ProductCard";
import { cn, formatPrice } from "@/utils";
import ProductGridList from "@atom/ProductGridList";
import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { ProductListSkeleton } from "@components/skeleton/ProductCardSkeleton";
import { selectedCity, selectedState } from "@/utils/location";
import { State } from "@/interface/location";

interface Props {
  products: Product[];
  showLimit?: number;
  offset?: number;
  fallbackText?: string;
  onUnSave?: (productId: string) => void;
  hideFallback?: boolean;
  skeletonLength?: number;
  statesInNigeria: State[];
}

export default function LazyLoadProducts(props: Props) {
  const [offset, setOffset] = useState(12);
  const [showingProducts, setShowingProducts] = useState<Product[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (!isVisible) return;
    if (offset >= props.products?.length) return;
    const nextTenProducts = props.products?.slice(
      offset,
      offset + props?.showLimit!,
    );
    setOffset(offset + props?.showLimit!);
    setShowingProducts([...showingProducts, ...nextTenProducts]);
  }, [isVisible, props?.products, offset, showingProducts, props?.showLimit]);

  useEffect(() => {
    setOffset(props.offset || 12);
    setShowingProducts(props.products?.slice(0, props?.showLimit));
  }, [props?.offset, props?.showLimit, props?.products]);

  return (
    <ProductGridList
      total={showingProducts?.length}
      isEmpty={showingProducts.length === 0}
      className={"relative"}
    >
      {showingProducts.length ? (
        showingProducts.map((product) => (
          <ProductCard
            price={formatPrice(product?.price)}
            productName={product?.name}
            description={product?.description}
            state={selectedState(props.statesInNigeria, product?.state)}
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
        ))
      ) : props.hideFallback ? (
        <ProductListSkeleton length={props.skeletonLength || 4} />
      ) : (
        <div className={"w-full text-xs text-grey7 md:text-sm"}>
          {props?.fallbackText || "No products found"}
        </div>
      )}

      {props?.products?.length > showingProducts?.length && (
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
      )}
    </ProductGridList>
  );
}
