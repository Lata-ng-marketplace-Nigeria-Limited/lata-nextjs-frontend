"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/interface/products";
import { FileData } from "@/interface/file";
import { cn } from "@/utils";
import CarouselPinButton from "@components/product/CarouselPinButton";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  CarouselItem,
  type CarouselApi,
} from "@components/ui/carousel";

interface Props {
  product: Product;
}

export default function ProductCarousel(props: Props) {
  const [images, setImages] = useState<FileData[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (props.product) {
      setImages(props.product.files);
    }
  }, [props.product]);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
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
      setApi={setApi}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem
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
            key={index}
          >
            <Image
              className={"w-full rounded-[12px] h-full object-contain"}
              src={image.url}
              alt={props.product.name}
              layout={"fill"}
              objectFit={"contain"}
              style={{
                objectFit: "contain",
              }}
              unoptimized

            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {images.length > 1 ? (
        <>
          <CarouselPrevious />
          <CarouselNext />
          <div className="absolute z-[10000px] flex space-x-3 -translate-x-1/2 bottom-2 left-1/2  p-1">
            {images.map((_, index) => (
              <CarouselPinButton
                key={index}
                index={index}
                current={current}
                total={count}
              />
            ))}
          </div>
        </>
      ) : null}
    </Carousel>
  );
}
