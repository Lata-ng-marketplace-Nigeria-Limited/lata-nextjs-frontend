import ProductCarousel from "@components/product/ProductCarousel";
import { Product } from "@/interface/products";
import { cn, formatPrice, getTimeFromNow } from "@/utils";
import { ClockIcon } from "@atom/icons/Clock";
import { MapPinIcon } from "@atom/icons/MapPin";
import Hr from "@atom/Hr";
import { useDiscount } from "@/hooks/useDiscount";
import PercentageOff from "../atom/PercentageOff";
import { useLocation } from "@/hooks/useLocation";

interface Props {
  product: Product;
}

export default function ProductDetails(props: Props) {
  const { location } = useLocation();

  const priceDetails = {
    amount: props.product?.price,
    discount: Number(props.product?.discount) || Number("0"),
  };

  const { initialAmount, discountedAmount } = useDiscount(priceDetails);

  const getSelectedState = () => {
    if (!location) {
      return;
    }
    const getState = location.find((loc) => loc.id === props.product?.state);
    return getState?.name || props.product?.state;
  };

  return (
    <div
      className={cn(`
        flex
        w-full
        flex-col
        gap-y-3
        rounded-[12px]
        border
        border-grey2
        p-2.5
        sm:p-0
     `)}
    >
      <ProductCarousel product={props.product} />

      <div className={cn(`flex flex-col gap-y-2.5 sm:px-3`)}>
        {props.product?.discount ? (
          <div className="flex items-center gap-4">
            <p className={cn(`font-semibold text-grey4 line-through`)}>
              {formatPrice(initialAmount)}
            </p>
            <PercentageOff
              discount={Number(props.product.discount)}
              className="ml-0 mr-0 mt-0"
            />
          </div>
        ) : (
          ""
        )}
        <p className={cn(`font-semibold text-primary`)}>{discountedAmount}</p>
        <p className={cn(`font-medium text-grey10`)}>{props.product?.name}</p>

        <div
          className={
            "flex flex-wrap items-center gap-x-3 gap-y-2 sm:mt-[0.25rem]"
          }
        >
          <p className={"flex shrink-0 items-center gap-x-[0.125rem]"}>
            <ClockIcon className={cn(`h-4 w-4 `)} />
            <span className={cn(`text-sm text-grey5`)}>
              Posted {getTimeFromNow(props.product?.createdAt)}
            </span>
          </p>

          <p className={"flex shrink-0 items-center gap-x-[0.125rem]"}>
            <MapPinIcon className={cn(`h-4 w-4 `)} pathClass={"stroke-grey5"} />
            <span className={cn(`text-sm text-grey5`)}>
              {getSelectedState()}
            </span>
          </p>
        </div>

        <Hr className={"border-grey1"} />

        <div className={"mb-[2px] sm:mb-3 sm:mt-[0.25rem]"}>
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
                mb-3
                mt-2
                text-sm
                text-grey6
            `)}
          >
            {props.product?.description}
          </p>
        </div>

        <div className={"mb-[2px] sm:mb-3 sm:mt-[0.25rem]"}>
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
                mb-3
                mt-2
                text-sm
                text-grey6
            `)}
          >
            {props.product?.category?.name}
          </p>
        </div>

        <div
          className={cn(
            { hidden: !props?.product?.subCategoryId },
            "mb-[2px] sm:mb-3 sm:mt-[0.25rem]",
          )}
        >
          <p
            className={cn(
              `
                text-sm 
                font-semibold 
                text-grey8 
                sm:text-base 
                sm:font-medium
            `,
            )}
          >
            Product subcategory
          </p>

          <p
            className={cn(`
                mb-3
                mt-2
                text-sm
                text-grey6
            `)}
          >
            {props.product?.subCategoryId}
          </p>
        </div>

        <div
          className={cn(
            { hidden: !props?.product?.productType },
            "mb-[2px] sm:mb-3 sm:mt-[0.25rem]",
          )}
        >
          <p
            className={cn(`
                text-sm 
                font-semibold 
                text-grey8 
                sm:text-base 
                sm:font-medium
            `)}
          >
            Product type
          </p>

          <p
            className={cn(`
                mb-3
                mt-2
                text-sm
                text-grey6
            `)}
          >
            {props.product?.productType}
          </p>
        </div>
      </div>
    </div>
  );
}
