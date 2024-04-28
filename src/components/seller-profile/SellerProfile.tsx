"use client";

import SellerContact from "@components/product/SellerContact";
import { User } from "@/interface/user";
import { cn, formatPrice } from "@/utils";
import SafetyTips from "@components/product/SafetyTips";
import ProductGridList from "@atom/ProductGridList";
import ProductCard from "@components/product/ProductCard";
import AboutSeller from "@components/seller-profile/AboutSeller";
import { selectedCity, selectedState } from "@/utils/location";
import { State } from "@/interface/location";

interface Props {
  seller: User;
  productId?: string;
  statesInNigeria: State[];
}

export const SellerProfile = ({
  seller,
  productId,
  statesInNigeria,
}: Props) => {
  return (
    <>
      <div
        className={
          "flex flex-col justify-between gap-x-6 gap-y-6  sm:flex-col sl:flex-row "
        }
      >
        <div className={"w-full max-w-[] tablet:min-w-[330px]"}>
          <SellerContact
            productName={seller?.name}
            sellerInfo={seller}
            productId={productId}
            type={"expanded"}
          />
        </div>

        <div
          className={cn(`
              flex 
              w-full 
              flex-col 
              gap-x-3
              gap-y-6
              sm:flex-row
              sl:max-w-[472px]
              sl:flex-col
            `)}
        >
          <AboutSeller sellerInfo={seller} />
          <SafetyTips />
        </div>
      </div>

      <div className={"mt-6 sl:mt-8"}>
        <h2
          className={
            "text-xs font-semibold text-grey9 sm:text-base sm:font-medium "
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
                  state={
                    selectedState(statesInNigeria, product.state) 
                  }
                  city={
                    selectedCity(
                      statesInNigeria,
                      product.state,
                      product.city,
                    ) 
                  }
                  imageSrc={product.files?.[0]?.url}
                  product={product}
                  createProductPreview={false}
                  key={i}
                />
              ))}
            </>
          ) : (
            <div className={"text-xs text-grey7 md:text-sm"}>
              Seller has no products yet
            </div>
          )}
        </ProductGridList>
      </div>
    </>
  );
};
