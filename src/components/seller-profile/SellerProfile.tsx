"use client";

import SellerContact from "@components/product/SellerContact";
import { User } from "@/interface/user";
import { cn, formatPrice } from "@/utils";
import SafetyTips from "@components/product/SafetyTips";
import ProductGridList from "@atom/ProductGridList";
import ProductCard from "@components/product/ProductCard";
import AboutSeller from "@components/seller-profile/AboutSeller";

interface Props {
  seller: User;
  productId?: string;
}

export const SellerProfile = ({ seller, productId }: Props) => {
  return (
    <>
      <div
        className={
          "flex gap-x-6 gap-y-6 justify-between flex-col  sm:flex-col sl:flex-row "
        }
      >
        <div className={"max-w-[] tablet:min-w-[330px] w-full"}>
          <SellerContact
            productName={seller?.name}
            sellerInfo={seller}
            productId={productId}
            type={"expanded"}
          />
        </div>

        <div
          className={cn(`
              w-full 
              sl:max-w-[472px] 
              flex 
              flex-col
              sm:flex-row
              sl:flex-col
              gap-y-6
              gap-x-3
            `)}
        >
          <AboutSeller sellerInfo={seller} />
          <SafetyTips />
        </div>
      </div>

      <div className={"mt-6 sl:mt-8"}>
        <h2
          className={
            "text-xs sm:text-base font-semibold sm:font-medium text-grey9 "
          }
        >
          Seller’s products
        </h2>

        <ProductGridList
          total={seller.products.length}
          isEmpty={seller.products.length === 0}
        >
          {seller.products.length ? (
            <>
              {seller.products.map((product, i) => (
                <ProductCard
                  price={formatPrice(product.price)}
                  productName={product.name}
                  description={product.description}
                  location={product.location}
                  imageSrc={product.files?.[0]?.url}
                  product={product}
                  createProductPreview={false}
                  key={i}
                />
              ))}
            </>
          ) : (
            <div className={"text-grey7 text-xs md:text-sm"}>
              Seller has no products yet
            </div>
          )}
        </ProductGridList>
      </div>
    </>
  );
};
