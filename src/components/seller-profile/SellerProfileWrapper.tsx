import { getSellerProfileApi } from "@/api/auth";
import { getAllStatesApi } from "@/api/location";
import { getReelsApi } from "@/api/reels";
import { SellerProfile } from "@components/seller-profile/SellerProfile";

interface Props {
  id: string;
  productId?: string;
}
export const SellerProfileWrapper = async ({ id, productId }: Props) => {
  const [sellerData, statesInNigeriaData, reelsData] = await Promise.all([
    getSellerProfileApi(id),
    getAllStatesApi(),
    getReelsApi({ sellerId: id }),
  ]);

  const { seller, message } = sellerData;

  return (
    <div>
      {message && !seller && <p>{message}</p>}
      {message && seller && (
        <SellerProfile
          seller={seller}
          productId={productId}
          statesInNigeria={statesInNigeriaData?.data || []}
          reelsGrouped={reelsData?.reels || []}
        />
      )}
    </div>
  );
};
