import React from "react";

interface UserBannerSkeletonProps {
  imgSize?: string;
}

const UserBannerSkeleton: React.FC<UserBannerSkeletonProps> = ({
  imgSize = "max-w-[9.6rem] max-h-[9.6rem]",
}) => {
  return (
    <div className="mb-6 animate-pulse rounded-xl border border-grey2 bg-gray-300 p-4 sl:p-6">
      <div
        className={`h-[7rem] w-full rounded-t-xl bg-purp3 sl:h-[9rem]`}
      ></div>
      <div className="px-7 xs:flex-row sl:flex sl:gap-5 sl:px-14">
        <div className="flex gap-x-4">
          <div
            className={`-translate-y-10 rounded-full border-4 border-white p-2 ${imgSize}`}
          >
            <div className="h-full w-full rounded-full bg-gray-300"></div>
          </div>
          <h2 className="mb-3 text-xl font-medium text-gray-400 sl:hidden">
            Loading...
          </h2>
        </div>

        <div>
          <h2 className="mb-3 text-3xl font-medium text-gray-400 max-sl:hidden">
            Loading...
          </h2>
          <div className="h-8 w-20 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default UserBannerSkeleton;
