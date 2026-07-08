import { getInActiveReelsApi } from "@/api/reels";
import { ReviewReel } from "./ReviewReel";

interface Props {
  page: string;
  search: string;
}

export const ReviewReelWrapper = async ({ search, page }: Props) => {
  const reelsData = await getInActiveReelsApi({
    page,
    search,
  });

  return (
    <ReviewReel
      reels={reelsData?.data || []}
      meta={reelsData?.meta}
      page={page}
      urlSearch={search}
    />
  );
};
