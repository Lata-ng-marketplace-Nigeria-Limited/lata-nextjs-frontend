import ProductCarousel from "@components/product/ProductCarousel";
import { Product } from "@/interface/products";
import { cn, formatPrice, getTimeFromNow } from "@/utils";
import { ClockIcon } from "@atom/icons/Clock";
import { MapPinIcon } from "@atom/icons/MapPin";
import Hr from "@atom/Hr";
import { useDiscount } from "@/hooks/useDiscount";
import PercentageOff from "../atom/PercentageOff";

interface Props {
  product: Product;
}

export default function ProductDetails(props: Props) {
  const priceDetails = {
    amount: props.product?.price,
    discount: props.product?.discount || 0,
  };

  const { initialAmount, discountedAmount } = useDiscount(priceDetails);

  return (
    <div
      className={cn(`
        border
        rounded-[12px]
        border-grey2
        p-2.5
        sm:p-0
        w-full
        flex
        flex-col
        gap-y-3
     `)}
    >
      <ProductCarousel product={props.product} />

      <div className={cn(`flex flex-col gap-y-2.5 sm:px-3`)}>
        {props.product?.discount ? (
          <div className="flex items-center gap-4">
            <p className={cn(`font-semibold line-through text-grey4`)}>
              {formatPrice(initialAmount)}
            </p>
            <PercentageOff
              discount={props.product.discount}
              className="mr-0 ml-0 mt-0"
            />
          </div>
        ) : (
          ""
        )}
        <p className={cn(`text-primary font-semibold`)}>{discountedAmount}</p>
        <p className={cn(`text-grey10 font-medium`)}>{props.product?.name}</p>

        <div
          className={
            "flex gap-x-3 gap-y-2 items-center flex-wrap sm:mt-[0.25rem]"
          }
        >
          <p className={"flex items-center gap-x-[0.125rem] shrink-0"}>
            <ClockIcon className={cn(`w-4 h-4 `)} />
            <span className={cn(`text-grey5 text-sm`)}>
              Posted {getTimeFromNow(props.product?.createdAt)}
            </span>
          </p>

          <p className={"flex items-center gap-x-[0.125rem] shrink-0"}>
            <MapPinIcon className={cn(`w-4 h-4 `)} pathClass={"stroke-grey5"} />
            <span className={cn(`text-grey5 text-sm`)}>
              {props.product?.state}
            </span>
          </p>
        </div>

        <Hr className={"border-grey1"} />

        <div className={"sm:mt-[0.25rem] mb-[2px] sm:mb-3"}>
          <p
            className={cn(`
                text-sm 
                font-semibold 
                text-grey8 
                sm:text-base 
                sm:font-medium
            `)}
          >
            Product description
          </p>

          <p
            className={cn(`
                text-grey6
                text-sm
                mt-2
                mb-3
            `)}
          >
            {props.product?.description}
          </p>
        </div>

        <div className={"sm:mt-[0.25rem] mb-[2px] sm:mb-3"}>
          <p
            className={cn(`
                text-sm 
                font-semibold 
                text-grey8 
                sm:text-base 
                sm:font-medium
            `)}
          >
            Product category
          </p>

          <p
            className={cn(`
                text-grey6
                text-sm
                mt-2
                mb-3
            `)}
          >
            {props.product?.category?.name}
          </p>
        </div>

        <div className={"sm:mt-[0.25rem] mb-[2px] sm:mb-3"}>
          <p
            className={cn(`
                text-sm 
                font-semibold 
                text-grey8 
                sm:text-base 
                sm:font-medium
            `)}
          >
            Product Subcategory
          </p>

          <p
            className={cn(`
                text-grey6
                text-sm
                mt-2
                mb-3
            `)}
          >
            {props.product?.subCategoryId}
          </p>
        </div>
      </div>
    </div>
  );
}
