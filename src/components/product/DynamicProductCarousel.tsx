"use client";

import dynamic from "next/dynamic";
import { Product } from "@/interface/products";

const ProductCarousel = dynamic(() => import("./ProductCarousel"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[300px] animate-pulse rounded-[12px] bg-gray-200" />
    ),
});

interface Props {
    product: Product;
}

export default function DynamicProductCarousel({ product }: Props) {
    return <ProductCarousel product={product} />;
}
