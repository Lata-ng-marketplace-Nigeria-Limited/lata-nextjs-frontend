import React from 'react'

const AnalyticsTopCardSkeleton = () => {
    return (
      <div className="px-6 pb-[1.12rem] pt-[1.81rem] rounded-lg border-solid shadow-black/10 border-[1px] border-grey2">
        <div className="animate-pulse">
          <div className="mb-4 h-4 bg-gray-300 rounded-lg"></div>
          <div className="mb-4 h-8 bg-gray-300 rounded-lg"></div>
          <div className="h-4 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    );
  };

export default AnalyticsTopCardSkeleton