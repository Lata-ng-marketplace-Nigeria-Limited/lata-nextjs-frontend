import { cn } from "@/utils";
import { skeletonShimmerClass } from "@components/skeleton/ProductCardSkeleton";

export const ViewProductInsightSkeleton = () => {
  return (
    <div
      className={cn(
        skeletonShimmerClass,
        `
          relative 
          overflow-hidden 
          w-full 
          max-w-full 
          min-w-full 
          flex
          flex-col
          sm:min-w-[322px] 
          lg:min-w-[430px] 
          sm:max-w-[430px]
          gap-y-6
          
        `,
      )}
    >
      <div
        className={cn(`
            rounded-[10px] 
            border 
            border-gray-200 
            gap-y-6
            p-3
            xls:p-4
            xs:p-6
            px-[10px]
            py-6
            sm:px-[20px]
            h-max
        `)}
      >
        <div className={"flex flex-col gap-y-3 md:gap-y-6 mb-3"}>
          <div className={cn(`bg-gray-200 h-[250px]`)} />
        </div>
      </div>

      <div
        className={cn(`
            rounded-[10px] 
            border 
            border-gray-200 
            gap-y-6
            p-3
            xls:p-4
            xs:p-6
            px-[10px]
            py-6
            sm:px-[20px]
            h-max
        `)}
      >
        <div className={"flex flex-col gap-y-3 md:gap-y-6 mb-3"}>
          <div className={cn(`bg-gray-200 h-[250px]`)} />
        </div>
      </div>
    </div>
  );
};
