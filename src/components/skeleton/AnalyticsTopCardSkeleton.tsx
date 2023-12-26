import React from "react";

const AnalyticsTopCardSkeleton = () => {
  return (
    <section className="border-grey2 border-[1px] border-solid rounded-xl py-[2.1875rem] px-[1.4375rem] mb-8 mt-6">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </section>
  );
};

const SkeletonCard = () => {
  return (
    <div className="px-6 pb-[1.12rem] pt-[1.81rem] rounded-lg border-solid shadow-black/10 border-[1px] border-grey2 animate-pulse">
      <div className="mb-4 bg-gray-300 h-4 rounded-lg"></div>
      <div className="mb-4 bg-gray-300 h-8 rounded-lg"></div>
      <div className="bg-gray-300 h-4 rounded-lg"></div>
    </div>
  );
};

export default AnalyticsTopCardSkeleton;
