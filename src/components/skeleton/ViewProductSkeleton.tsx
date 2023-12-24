import {
  ProductCardSkeleton,
  skeletonShimmerClass,
} from "@components/skeleton/ProductCardSkeleton";
import { ViewProductCardSkeleton } from "@components/skeleton/ViewProductCardSkeleton";
import { cn } from "@/utils";
import { ViewProductInsightSkeleton } from "@components/skeleton/ViewProductInsightSkeleton";

export const ViewProductSkeleton = () => {
  return (
    <div
      className={cn(
        skeletonShimmerClass,
        `
            overflow-hidden 
            relative
            flex 
            flex-col 
            justify-between 
            sm:flex-row 
            gap-y-6 
            gap-x-3 
            xl:gap-x-[19px]
        `,
      )}
    >
      <ViewProductCardSkeleton />
      <ViewProductInsightSkeleton />
    </div>
  );
};
