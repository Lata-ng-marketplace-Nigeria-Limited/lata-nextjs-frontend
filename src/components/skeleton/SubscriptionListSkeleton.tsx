import { cn } from "@/utils";
import { skeletonShimmerClass } from "@components/skeleton/ProductCardSkeleton";
import HeaderText from "@atom/HeaderText";
import HeaderSubText from "@atom/HeaderSubText";
import React from "react";

export const SubscriptionListSkeleton = () => {
  const array = Array.from({ length: 4 }, (_, i) => i);
  return (
    <div>
      <HeaderText title>
        Increase your product sales with our subscription packages
      </HeaderText>
      <HeaderSubText>
        Choose the right category of ads for you products to experience massive
        sales
      </HeaderSubText>

      <div
        className={cn(
          skeletonShimmerClass,
          "mt-4 xs:mt-8 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6",
        )}
      >
        {array.map((_, i) => (
          <div
            key={i}
            className={cn(`
            flex 
            items-center 
            bg-gray-200 
            h-[150px] 
            sm:h-[200px] 
            justify-center 
            sm:justify-start 
            xs:max-w-[366px]
            tablet:min-w-[260px]
            rounded-[10px]
            gap-x-3.5
            p-[20px]
            xlg:p-[30px]
            xl:p-[40px]
            cursor-pointer
          `)}
          >
            <div className={"shrink-0"}>
              <div className="h-[80px] w-[80px] sm:w-[120px] sm:h-[120px] rounded-full bg-gray-50" />
            </div>
            <div className={"text-white flex flex-col gap-y-3"}>
              <div className="h-4 w-24 rounded-md bg-gray-50" />
              <div className="h-6 w-16 rounded-md bg-gray-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
