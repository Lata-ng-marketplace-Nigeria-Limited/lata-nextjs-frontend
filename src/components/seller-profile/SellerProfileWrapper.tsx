import { getSellerProfileApi } from "@/api/auth";
import { getAllStatesApi } from "@/api/location";
import { SellerProfile } from "@components/seller-profile/SellerProfile";

interface Props {
  id: string;
  productId?: string;
}
export const SellerProfileWrapper = async ({ id, productId }: Props) => {
  const { seller, message } = await getSellerProfileApi(id);
  const statesInNigeriaData = await getAllStatesApi();

  return (
    <div>
      {message && !seller && <p>{message}</p>}
      {message && seller && (
        <SellerProfile
          seller={seller}
          productId={productId}
          statesInNigeria={statesInNigeriaData?.data || []}
        />
      )}
    </div>
  );
};
