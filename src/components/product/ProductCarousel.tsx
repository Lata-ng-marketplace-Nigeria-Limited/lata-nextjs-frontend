"use client";
import { Product } from "@/interface/products";
import { useEffect, useState } from "react";
import { FileData } from "@/interface/file";
import { cn } from "@/utils";
import CarouselItem from "@molecule/CarouselItem";
import CarouselPinButton from "@components/product/CarouselPinButton";
import CarouselPrevBtn from "@molecule/CarouselPrevBtn";
import CarouselNextBtn from "@molecule/CarouselNextBtn";
import Image from "next/image";

interface Props {
  product: Product;
}

export default function ProductCarousel(props: Props) {
  const [images, setImages] = useState<FileData[]>([]);

  useEffect(() => {
    if (props.product) {
      setImages(props.product.files);
    }
  }, [props.product]);

  return (
    <div
      className={cn(`
          w-full
          rounded-[12px]
          h-[200px]
          xms:h-[250px]
          xs:h-[300px]
          sm:h-[250px]
          md:h-[300px]
          tablet:h-[250px]
          sl:h-[300px]
          lg:h-[320px]
          xlg:h-[350px]
          xl:h-[390px]
          relative 
          bg-white
      `)}
      id="animation-carousel"
      data-carousel="static"
    >
      {images.length > 1 ? (
        <>
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            {images.map((image, index) => (
              <CarouselItem
                key={index}
                src={image.url}
                alt={props.product.name}
              />
            ))}
          </div>

          <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-2 left-1/2  p-1">
            {images.map((_, index) => (
              <CarouselPinButton
                key={index}
                index={index}
                total={images.length}
              />
            ))}
          </div>

          <CarouselPrevBtn />
          <CarouselNextBtn />
        </>
      ) : null}

      {images.length === 1 ? (
        <img
          className={"w-full rounded-[12px] h-full object-contain"}
          src={images[0].url}
          alt={props.product.name}
          // width={0}
          // height={0}
          // objectFit={"contain"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      ) : null}
    </div>
  );
}
