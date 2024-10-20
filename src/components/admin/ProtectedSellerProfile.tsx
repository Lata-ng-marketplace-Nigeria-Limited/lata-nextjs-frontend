import { UserDetail, UserDetailContainer } from "@components/staff/UserDetail";
import UserBanner from "@components/staff/UserBanner";
import { DateTime } from "luxon";
import ProductGridList from "@components/atom/ProductGridList";
import ProductCard from "../product/ProductCard";
import { formatPrice } from "@/utils";
import FeedbackContent from "@components/feedback/FeedbackContent";
import { fetchAllMangersApi, getProtectedSellerApi } from "@/api/admin";
import SellerActionBtns from "./SellerActionBtns";
import { getAllStatesApi } from "@/api/location";
import { selectedCity, selectedState } from "@/utils/location";

interface Props {
  sellerId: string;
  query: string;
}
const ProtectedSellerProfile = async ({ sellerId, query }: Props) => {
  const [managers, response, statesData] = await Promise.all([
    fetchAllMangersApi(query),
    getProtectedSellerApi({ sellerId }),
    getAllStatesApi(),
  ]);

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
    <div className="">
      <div className="max-w-full gap-4 sm:flex sm:justify-between">
        <div className="sm:basis-[60%]">
          <UserBanner
            name={response?.data?.name || "No name"}
            role={response?.data?.role || ""}
            imgSrc={response?.data?.avatar}
            userId={response?.data?.id}
            user={response?.data}
          />

          <UserDetailContainer heading="About">
            <div className="sm:flex sm:items-center sm:justify-between sm:gap-6">
              <UserDetail
                hasGreyTitle
                title="Email"
                description={response?.data?.email || "No email"}
              />
              <UserDetail
                hasGreyTitle
                title="Subscriptions"
                description={
                  response?.data?.totalSubscriptions?.toLocaleString() || "0"
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

        <div className="sm:basis-[35%]">
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
            managers={managers?.data || []}
            seller={response?.data}
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
                    state={selectedState(statesData?.data, product.state)}
                    city={selectedCity(
                      statesData?.data,
                      product.state,
                      product.city,
                    )}
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
                    state={selectedState(statesData?.data, product.state)}
                    city={selectedCity(
                      statesData?.data,
                      product.state,
                      product.city,
                    )}
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
