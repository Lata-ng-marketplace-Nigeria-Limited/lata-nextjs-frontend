import { getSellerProfileApi } from "@/api/auth";
import { SellerProfile } from "@components/seller-profile/SellerProfile";

interface Props {
  id: string;
  productId?: string;
}
export const SellerProfileWrapper = async ({ id, productId }: Props) => {
  const { seller, message } = await getSellerProfileApi(id);

  return (
    <div>
      {message && !seller && <p>{message}</p>}
      {message && seller && (
        <SellerProfile seller={seller} productId={productId} />
      )}
    </div>
  );
};
