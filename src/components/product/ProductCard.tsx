"use client";
import { cn, formatPrice, safeParseJSON, truncateText } from "@/utils";
import { MapPinIcon } from "@atom/icons/MapPin";
import { SavedIcon } from "@atom/icons/Saved";
import Button from "@atom/Button";
import { Product } from "@/interface/products";
import { DASHBOARD_PRODUCT_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import Image from "next/image";
import { saveAProductApi, unSaveAProductApi } from "@/api/product";
import { useUser } from "@hooks/useUser";
import { useToast } from "@components/ui/use-toast";
import Link from "next/link";
import { IMAGE_BLUR_URL } from "@/constants/others";
import { generateSellerAnalyticsApi } from "@/api/view";
import PercentageOff from "../atom/PercentageOff";
import { useLocation } from "@/hooks/useLocation";

type Props = {
  imageSrc?: string;
  price?: string | number;
  productName?: string;
  description?: string;
  state?: string;
  city: string;
  discount?: string | number;
  onUnSave?: (productId: string) => void;
  trending?: boolean;
} & (
  | {
      product?: Product;
      createProductPreview: true;
    }
  | {
      product: Product;
      createProductPreview: false;
    }
);

export default function ProductCard(props: Props) {
  const nav = useRouter();
  const { user, updateUser } = useUser();

  const [saved, setSaved] = useState(false);
  const [showSaved, setShowSaved] = useState(true);
  const [hasSetSaved, setHasSetSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [planName, setPlanName] = useState("");
  const [initialAmount, setInitialAmount] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const { location } = useLocation();

  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;
  const { toast } = useToast();

  const handleImage = useCallback(
    (returnImage?: boolean) => {
      const meta = safeParseJSON(props.product?.meta || "{}");
      const image = meta?.selectedImage || props?.imageSrc;
      if (returnImage) return image;
      setImage(meta?.selectedImage || props?.imageSrc);
    },
    [props.product?.meta, props?.imageSrc],
  );

  const registerView = useCallback(async () => {
    if (user?.id === props.product?.userId) return;
    if (!props.product?.userId) return;
    try {
      await generateSellerAnalyticsApi(
        "VIEW",
        props.product?.id || "",
        props.product?.userId || "",
      );
    } catch (error) {
      console.log("Error registering view", error);
    }
  }, [props.product?.id, user?.id, props.product?.userId]);

  useEffect(() => {
    const handleImageIfNeeded = () => {
      if (!image) {
        handleImage();
      }
    };

    if (isVisible) {
      registerView();
      handleImageIfNeeded();
    }
  }, [isVisible, image, handleImage, registerView]);

  useEffect(() => {
    if (user?.id && !hasSetSaved) {
      const isProductSaved = user?.savedProducts?.find(
        (savedProduct: any) => savedProduct?.productId === props.product?.id,
      );
      setHasSetSaved(true);
      setSaved(!!isProductSaved);
    }

    if (user?.id === props.product?.userId) {
      setShowSaved(false);
    }

    if (props.createProductPreview) {
      handleImage();
    }

    if (props?.product?.planName) {
      setPlanName(props?.product?.planName);
    }

    if (props.product?.meta) {
      const meta = safeParseJSON(props.product?.meta);
      setPlanName(meta?.planName);
    }
  }, [
    user,
    props.product,
    props.createProductPreview,
    hasSetSaved,
    props?.product?.planName,
    props.product?.meta,
    handleImage,
    props?.product?.id,
  ]);

  const handleSaveProduct = async () => {
    if (!user?.id) {
      toast({
        description: "You need to be logged in to save a product",
        variant: "warning",
      });
      return;
    }
    const isSaved = !saved;
    setSaved((prev) => !prev);
    try {
      if (isSaved) {
        const { userData: userInfo } = await saveAProductApi(
          props.product?.id || "",
        );
        await updateUser(userInfo);
      } else {
        const { userData: userInfo } = await unSaveAProductApi(
          props.product?.id || "",
        );
        props.onUnSave?.(props.product?.id || "");
        await updateUser(userInfo);
      }
    } catch (error) {
      toast({
        title: saved ? "Could not save product" : "Could not unsave product",
        description: "Please try again later",
        variant: "destructive",
      });
      setSaved((prev) => !prev);
    }
  };

  const state = () => {
    const findState = location?.find((loc) => loc.id === props.state);
    return findState;
  };

  const city = () => {
    if (!state()) return;
    const findCity = state()?.cities?.find((city) => city.id === props.city);
    return findCity;
  };

  const handleLocationDisplay = () => {
    const stateName = state()?.name || props.state;
    const cityName = city()?.name || props.city;

    if (!props?.state && props.createProductPreview) {
      return "Location";
    } else if (!props.city) {
      return stateName;
    } else {
      return `${cityName}, ${stateName}`;
    }
  };

  const handleDiscount = useCallback(() => {
    const amount = props.product?.price || 0;
    const discount = Number(props.product?.discount) || Number("0");
    if (discount) {
      setDiscountedAmount(amount - (amount * discount) / 100);
      setInitialAmount(amount);
    } else {
      setDiscountedAmount(amount || 0);
      setInitialAmount(0);
    }
  }, [props.product?.price, props.product?.discount]);

  useEffect(() => {
    handleDiscount();
  }, [handleDiscount]);

  const handlDisplayedPrice = () => {
    if (props.createProductPreview) {
      return !props?.price ? "Product price" : props?.price;
    } else {
      return formatPrice(discountedAmount);
    }
  };

  return (
    <div
      className={cn(
        `
        mx-auto
        w-full
        max-w-[17rem]
        shrink-0
        rounded-[0.625rem]
        border
        border-grey3
        p-2
        xms:mx-0
        sm:px-2.5
        sm:py-3
      `,
        {
          "max-w-[350px] px-2.5 py-3 sm:w-screen sm:max-w-[305px] sm:p-3 tablet:max-w-[380px] xlg:max-w-[500px]":
            props.createProductPreview,
        },
      )}
      ref={ref}
    >
      <div
        className={cn(
          `
            relative
            h-[7.6rem]
            w-full
            rounded-[0.625rem]
            sm:h-[10rem]
        `,
          {
            "h-[200px] bg-purp3 sm:h-[220px] tablet:h-[300px]  xlg:h-[335px]":
              props.createProductPreview,
            "flex items-center justify-center":
              !props.imageSrc && props.createProductPreview,
          },
        )}
      >
        {props.product?.status === "INACTIVE" && (
          <div
            className={cn(`
              absolute
              bottom-0
              right-0
              rounded-[3px]
              border
              border-primary
              bg-white
              px-1
              py-1
              text-xs
              font-medium
              text-primary
            `)}
          >
            Under Review
          </div>
        )}

        {planName && (
          <div
            className={
              "absolute left-0 top-0 rounded-[3px] bg-primary px-4 py-[7px] text-white"
            }
          >
            {planName}
          </div>
        )}

        {(!!props?.imageSrc || !props.createProductPreview) && image && (
          <Image
            src={image}
            className={cn("h-full w-full  rounded-[0.625rem]", {
              "object-cover": !props?.createProductPreview,
            })}
            alt={props?.product?.name || ""}
            loading="lazy"
            height={160}
            width={247}
            placeholder={"blur"}
            blurDataURL={IMAGE_BLUR_URL}
          />
        )}

        {!props?.imageSrc && props.createProductPreview && (
          <p
            className={
              "text-sm font-medium text-grey8 sm:text-[0.9375rem] tablet:text-[1rem] sl:text-[1.25rem]"
            }
          >
            Product Photo
          </p>
        )}
      </div>

      <div className={"mt-2 flex justify-between sm:mt-3"}>
        <Link
          className={cn("flex flex-col gap-y-2", {
            "mb-4 gap-y-4": props.createProductPreview,
            "cursor-pointer": !props.createProductPreview,
          })}
          href={`${DASHBOARD_PRODUCT_ROUTE}/${props.product?.id}`}
          onClick={(e) => {
            if (!props.createProductPreview) return;
            e.preventDefault();
          }}
        >
          {props.product?.discount ? (
            <div className="flex flex-col items-start gap-1">
              <PercentageOff
                discount={Number(props.product.discount)}
                className="ml-0 mr-0 mt-0"
              />

              <p className={cn(`font-semibold text-grey4 line-through`)}>
                {formatPrice(initialAmount)}
              </p>
            </div>
          ) : (
            ""
          )}
          <p className={"text-sm font-bold text-primary sm:text-base"}>
            {handlDisplayedPrice()}
          </p>
          <p className={"max-w-[24ch] text-xs text-grey9 sm:text-sm"}>
            {!props?.productName && props.createProductPreview
              ? "Product name"
              : props?.productName}
          </p>
          <p
            className={cn("max-w-[24ch] text-[10px] text-grey6  sm:text-xs", {
              "max-w-full": props.createProductPreview,
            })}
          >
            {!props?.description && props.createProductPreview
              ? "Product description"
              : truncateText(props?.description || "", 51)}
          </p>
          <p
            className={
              "mt-auto flex items-center gap-x-1 text-[10px] text-grey5 sm:text-xs"
            }
          >
            <MapPinIcon className="h-1.5 w-1.5 sm:h-3 sm:w-3" />
            {handleLocationDisplay()}
          </p>
        </Link>

        <div
          className={cn("flex items-end justify-end", {
            hidden: props.createProductPreview || !showSaved,
          })}
        >
          <Button
            format={"icon"}
            className={
              "grid h-6 w-6 place-items-center rounded-full bg-offwhite after:hidden hover:bg-offwhite sm:h-8 sm:w-8"
            }
            onClick={handleSaveProduct}
            disabled={loading}
            aria-label={saved ? "un save product" : "save product"}
          >
            <SavedIcon
              className={"h-4 w-4 sm:h-6 sm:w-6"}
              pathClass={cn("stroke-primary", {
                "fill-primary": saved,
              })}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
