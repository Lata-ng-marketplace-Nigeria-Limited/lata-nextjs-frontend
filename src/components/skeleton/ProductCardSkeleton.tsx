import { cn } from "@/utils";
import ProductGridList from "@atom/ProductGridList";

export const skeletonShimmerClass =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export const ProductCardSkeleton = () => {
  return (
    <div
      className={cn(
        skeletonShimmerClass,
        `
        relative
        mx-auto
        w-full
        max-w-[17rem]
        shrink-0
        overflow-hidden
        rounded-[0.625rem]
        border
        border-grey3
        bg-white
        p-2
        xms:mx-0
        sm:px-2.5
        sm:py-3
      `,
      )}
    >
      <div
        className={cn(`
            relative
            h-[7.6rem]
            w-full
            rounded-[0.625rem]
            bg-gray-200
            sm:h-[10rem]
        `)}
      />

      <div className={"mt-2 flex justify-between sm:mt-3"}>
        <div className={"flex w-full flex-col gap-y-2"}>
          <div className="h-5 w-1/2 rounded-md bg-gray-100" />
          <div className="h-4 w-3/4 rounded-md bg-gray-100" />
          <div className="h-3 w-full rounded-md bg-gray-100" />
          <div className="mt-auto h-3 w-1/2 rounded-md bg-gray-100" />
        </div>

        <div className={"flex items-end justify-end"}>
          <div className="h-6 w-6 rounded-full bg-gray-100 sm:h-8 sm:w-8" />
        </div>
      </div>
    </div>
  );
};

interface Props {
  length?: number;
}

export const ProductListSkeleton = ({ length = 12 }: Props) => {
  const products = Array.from({ length }, (_, i) => {
    return i;
  });
  return (
    <ProductGridList>
      {products.map((val) => (
        <ProductCardSkeleton key={val} />
      ))}
    </ProductGridList>
  );
};
