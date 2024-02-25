import { UserDetail, UserDetailContainer } from "@components/staff/UserDetail";
import Button from "@components/atom/Button";
import UserImage from "@components/staff/download (1).jpeg";
import UserBanner from "@components/staff/UserBanner";
import { DateTime } from "luxon";
import ProductGridList from "@components/atom/ProductGridList";
import ProductCard from "../product/ProductCard";
import { formatPrice } from "@/utils";
import FeedbackContent from "@components/feedback/FeedbackContent";
import { getProtectedSellerApi } from "@/api/admin";
import SellerActionBtns from "./SellerActionBtns";

interface Props {
  sellerId: string;
}
const ProtectedSellerProfile = async ({ sellerId }: Props) => {
  const response = await getProtectedSellerApi({ sellerId });

  const planDuration = () => {
    const duration = Number(response?.data?.plan?.duration);
    if (!duration) return "N/A";
    if (Number(duration) === 1) {
      return duration + " month";
    }
    return duration + " months";
  };

  const subDate = (date: string) => {
    if (!date) return "N/A";
    return DateTime.fromISO(date).toFormat("dd LLL, yyyy");
  };

  return (
    <div>
      <div className="sl:flex sl:gap-8">
        <div className="sl:basis-[70%]">
          <UserBanner
            name={response?.data?.name || "No name"}
            imgSrc={response?.data?.avatar || UserImage}
            btnText="Send Message to seller"
          />

          <UserDetailContainer heading="About">
            <div className="sl:flex sl:items-center sl:justify-between sl:gap-2">
              <UserDetail
                hasGreyTitle
                title="Email"
                description={response?.data?.email || "No email"}
              />
              <UserDetail
                hasGreyTitle
                title="Subscriptions"
                description={
                  response?.data?.totalSubscriptions?.toLocaleString() || "O"
                }
              />
              <UserDetail
                hasGreyTitle
                title="Phone"
                description={response?.data?.phoneNumber || "No Phone number"}
              />
              <UserDetail
                hasGreyTitle
                title="Manager"
                description={response?.data?.managerName || "No manager"}
              />
            </div>
          </UserDetailContainer>

          <UserDetailContainer heading="Bio">
            <p className="font-normal text-grey6">
              {response?.data?.aboutBusiness || "No bio"}
            </p>
          </UserDetailContainer>

          <UserDetailContainer heading="Address">
            <p className="font-normal text-grey6">
              {response?.data?.address || "No address"}
            </p>
          </UserDetailContainer>
        </div>

        <div className="sl:basis-[30%]">
          <UserDetailContainer heading="Posts">
            <UserDetail
              hasGreyDescription
              title={
                Number(response?.data?.approvedPosts)?.toLocaleString() || "0"
              }
              description="Approved post"
            />
            <UserDetail
              hasGreyDescription
              title={
                Number(response?.data?.cancelledPosts)?.toLocaleString() || "0"
              }
              description="Cancelled post"
            />
            <UserDetail
              hasGreyDescription
              title={
                Number(response?.data?.totalPosts)?.toLocaleString() || "0"
              }
              description="Total post"
            />
          </UserDetailContainer>

          <UserDetailContainer heading="Subscription">
            <UserDetail
              hasGreyDescription
              title={response?.data?.plan?.name || "N/A"}
              description="Plan"
            />
            <UserDetail
              hasGreyDescription
              title={planDuration()}
              description="Duration"
            />
            <UserDetail
              hasGreyDescription
              title={subDate(response?.data?.subscriptionPaidAt || "") || "-"}
              description="Activated date"
            />
            <UserDetail
              hasGreyDescription
              title={
                subDate(response?.data?.subscriptionExpiryDate || "") || "-"
              }
              description="Expiry date"
            />
          </UserDetailContainer>
          <SellerActionBtns
            managers={response?.managers || []}
            sellerId={sellerId}
            sellerName={response?.data?.name || "No name"}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-base font-medium">Pending Posts</h2>
        <ProductGridList
          total={response?.data?.products.length}
          isEmpty={response?.data?.products.length === 0}
        >
          {response?.data?.products?.filter((p) => p.status === "INACTIVE")
            .length ? (
            <>
              {response?.data?.products
                .filter((p) => p.status == "INACTIVE")
                ?.map((product, i) => (
                  <ProductCard
                    price={formatPrice(product.price)}
                    productName={product.name}
                    description={product.description}
                    state={product.state}
                    city={product.city}
                    imageSrc={product.files?.[0]?.url}
                    product={product}
                    createProductPreview={false}
                    key={i}
                  />
                ))}
            </>
          ) : (
            <div className={"text-xs text-grey7 md:text-sm"}>
              Seller has no pending products
            </div>
          )}
        </ProductGridList>
      </div>

      <div className="mb-8">
        <h2 className="text-base font-medium">Other Posts</h2>
        <ProductGridList
          total={response?.data?.products.length}
          isEmpty={response?.data?.products.length === 0}
        >
          {response?.data?.products?.length ? (
            <>
              {response?.data?.products
                .filter((p) => p.status == "ACTIVE")
                ?.map((product, i) => (
                  <ProductCard
                    price={formatPrice(product.price)}
                    productName={product.name}
                    description={product.description}
                    state={product.state}
                    city={product.city}
                    imageSrc={product.files?.[0]?.url}
                    product={product}
                    createProductPreview={false}
                    key={i}
                  />
                ))}
            </>
          ) : (
            <div className={"text-xs text-grey7 md:text-sm"}>
              Seller has no active products yet
            </div>
          )}
        </ProductGridList>
      </div>

      <div>
        <h2 className="mb-3 text-base font-medium">Feedbacks</h2>

        {response?.feedbacks?.length ? (
          response?.feedbacks?.map((feedback, i) => (
            <FeedbackContent feedback={feedback} key={i} hideLink />
          ))
        ) : (
          <div className={"text-xs text-grey7 md:text-sm"}>
            Seller has no feedback yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtectedSellerProfile;
