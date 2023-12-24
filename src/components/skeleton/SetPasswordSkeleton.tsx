import { cn } from "@/utils";
import { skeletonShimmerClass } from "@components/skeleton/ProductCardSkeleton";

export const SetPasswordSkeleton = () => {
  return (
    <div className={cn(skeletonShimmerClass, "relative flex flex-col gap-y-6")}>
      <div className={cn("bg-gray-200 h-[16px]")} />
      <div className={cn("h-[2rem] sm:h-12 rounded-md bg-gray-200")} />
      <div>
        <div className={cn("h-[2rem] sm:h-12 rounded-md bg-gray-200")} />
        <div className={cn("bg-gray-200 mt-3 h-[16px] max-w-[220px]")} />
      </div>
    </div>
  );
};
