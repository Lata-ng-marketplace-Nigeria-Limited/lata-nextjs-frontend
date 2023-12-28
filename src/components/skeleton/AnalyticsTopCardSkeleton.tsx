import React from "react";

const AnalyticsTopCardSkeleton = () => {
  return (
    <section className="border-grey2 border-[1px] border-solid rounded-xl py-2 tablet:py-4 lg:py-[2.1875rem] px-2 tablet:px-[1.4375rem] mb-8 mt-6">
      <div className="grid grid-cols-4 gap-2 tablet:gap-4">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </section>
  );
};

const SkeletonCard = () => {
  return (
    <div className="px-2 tablet:px-4 lg:px-6 lg:pb-[1.12rem] pb-[0.85rem] lg:pt-[1.81rem] pt-[1.5rem] rounded-lg border-solid shadow-black/10 border-[1px] border-grey2 animate-pulse">
      <p className="mb-2 bg-gray-200 h-3 rounded-lg w-3/4"></p>
      <p className="mb-2 bg-gray-200 h-6 rounded-lg w-1/5"></p>
      <p className="bg-gray-200 h-3 rounded-lg w-3/4"></p>
    </div>
  );
};

export default AnalyticsTopCardSkeleton;
