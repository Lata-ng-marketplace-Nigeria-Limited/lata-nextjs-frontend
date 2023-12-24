import { cn } from "@/utils";
import { skeletonShimmerClass } from "@components/skeleton/ProductCardSkeleton";
import Hr from "@atom/Hr";

export const ViewProductCardSkeleton = () => {
  return (
    <div
      className={cn(
        skeletonShimmerClass,
        `
            relative 
            overflow-hidden 
            border
            rounded-[12px]
            border-grey2
             p-2.5
            sm:p-0
            w-full
            
            flex
            flex-col
            gap-y-3
        
        `,
      )}
    >
      <div
        className={cn(`
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
          bg-gray-200
        `)}
      />

      <div className={cn(`flex flex-col gap-y-2.5 sm:px-3`)}>
        <div className={"h-6 w-full max-w-[158px] rounded-md bg-gray-200"} />
        <div className={"h-6 w-full max-w-[278px] rounded-md bg-gray-200"} />
        <div className={"h-3 w-full max-w-[200px] rounded-md bg-gray-200"} />
        <Hr className={"border-grey1"} />

        <div className={"sm:mt-[0.25rem] mb-[2px] sm:mb-3"}>
          <div className={"h-6 w-full max-w-[200px] rounded-md bg-gray-200"} />
          <div className={"h-12 w-full rounded-md bg-gray-200 mt-2 mb-3"} />
        </div>

        <div className={"sm:mt-[0.25rem] mb-[2px] sm:mb-3 "}>
          <div className={"h-6 w-full max-w-[200px] rounded-md bg-gray-200"} />
          <div
            className={
              "h-6 w-full max-w-[158px] rounded-md bg-gray-200 mt-2 mb-3"
            }
          />
        </div>
      </div>
    </div>
  );
};
