import React from "react";

const ProductInsightsLoadingSkeleton = () => {
  return (
    <div className="flex justify-between items-center flex-auto mb-6">
      <div className="text-2xl font-semibold whitespace-nowrap basis-1/2 h-6 bg-gray-200 rounded-md animate-pulse"></div>
      <div className="w-1/4 h-10 bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  );
};

export default ProductInsightsLoadingSkeleton;
