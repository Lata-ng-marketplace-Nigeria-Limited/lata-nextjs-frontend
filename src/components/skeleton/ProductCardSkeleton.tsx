import { cn } from "@/utils";
import ProductGridList from "@atom/ProductGridList";

export const skeletonShimmerClass =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export const ProductCardSkeleton = () => {
  return (
    <div
      className={cn(
        skeletonShimmerClass,
        `relative 
          overflow-hidden 
          rounded-[0.625rem]
          bg-gray-100 
          p-1
          shadow-sm
          w-full
          max-w-[17rem]
          `,
      )}
    >
      <div className="flex p-2 sm:px-2.5 py-2 bg-white rounded-[0.625rem_0.625rem_0px_0px]">
        <div className="h-[160px] w-[247px] rounded-[0.625rem] bg-gray-200" />
      </div>

      <div className="flex truncate bg-white px-2 sm:px-2.5 pb-2 justify-between gap-x-4 rounded-[0px_0px_0.625rem_0.625rem]">
        <div className={"w-full flex flex-col gap-y-2"}>
          <div className="h-6 w-full rounded-md bg-gray-200" />
          <div className="h-5 w-full rounded-md bg-gray-200" />
          <div className="h-9 w-full rounded-md bg-gray-200" />
          <div className="h-5 w-full rounded-md bg-gray-200" />
        </div>

        <div className={"flex justify-end items-end"}>
          <div className="h-6 w-6 rounded-md bg-gray-200" />
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
