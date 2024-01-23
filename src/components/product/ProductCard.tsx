"use client";
import { cn, formatPrice, safeParseJSON, truncateText } from "@/utils";
import { MapPinIcon } from "@atom/icons/MapPin";
import { SavedIcon } from "@atom/icons/Saved";
import Button from "@atom/Button";
import { Product } from "@/interface/products";
import { DASHBOARD_PRODUCT_ROUTE } from "@/constants/routes";
// import { useUser } from "@/hooks/useUser";
// import { userState } from "@/store/states/userState";
// import { toast } from "./Toaster";
// import { saveAProductApi, unSaveAProductApi } from "@/api/productApi";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import Image from "next/image";
import { saveAProductApi, unSaveAProductApi } from "@/api/product";
import { useUser } from "@hooks/useUser";
import { useToast } from "@components/ui/use-toast";
import Link from "next/link";
import { IMAGE_BLUR_URL } from "@/constants/others";
import { generateSellerAnalyticsApi } from "@/api/view";
import PercentageOff from "../atom/PercentageOff";
import { useDiscount } from "@/hooks/useDiscount";

// import { createIntersectionObserver } from "@solid-primitives/intersection-observer";

type Props = {
  imageSrc?: string;
  price?: string | number;
  productName?: string;
  description?: string;
  state?: string;
  city: string;
  discount?: number;
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
  const [placeHolderUrl, setPlaceHolderUrl] = useState("");

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
    [props.product?.meta, props?.imageSrc]
  );

  const registerView = useCallback(async () => {
    if (user?.id === props.product?.userId) return;
    if (!props.product?.userId) return;
    try {
      await generateSellerAnalyticsApi(
        "VIEW",
        props.product?.id || "",
        props.product?.userId || ""
      );
    } catch (error) {
      console.log("Error registering view", error);
    }
  }, [props.product?.id, user?.id, props.product?.userId]);

  useEffect(() => {
    if (!isVisible) return;
    registerView();
    if (image) return;
    handleImage();
  }, [isVisible, image, handleImage, registerView]);

  useEffect(() => {
    if (user?.id && !hasSetSaved) {
      const isProductSaved = user?.savedProducts?.find(
        (savedProduct: any) => savedProduct?.productId === props.product?.id
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
          props.product?.id || ""
        );
        await updateUser(userInfo);
      } else {
        const { userData: userInfo } = await unSaveAProductApi(
          props.product?.id || ""
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

  const handleLocationDisplay = () => {
    const stateName =
      props.state === "Abuja Federal Capital Territory" ? "Abuja" : props.state;
    if (!props?.state && props.createProductPreview) {
      return "Location";
    } else if (!props.city) {
      return stateName;
    } else {
      return `${props?.city} ${stateName}`;
    }
  };

  const priceDetails = {
    amount: props.product?.price || 0,
    discount: props.product?.discount || 0,
  };

  const { initialAmount, discountedAmount } = useDiscount(priceDetails);

  return (
    <div
      className={cn(
        `
        border
        border-grey3
        p-2
        sm:px-2.5
        sm:py-3
        shrink-0
        w-full
        max-w-[17rem]
        rounded-[0.625rem]
        mx-auto
        xms:mx-0
      `,
        {
          "sm:w-screen py-3 px-2.5 sm:p-3 max-w-[350px] sm:max-w-[305px] tablet:max-w-[380px] xlg:max-w-[500px]":
            props.createProductPreview,
        }
      )}
      ref={ref}
    >
      <div
        className={cn(
          `
            h-[7.6rem]
            w-full
            sm:h-[10rem]
            relative
            rounded-[0.625rem]
        `,
          {
            "h-[200px] sm:h-[220px] tablet:h-[300px] xlg:h-[335px]  bg-purp3":
              props.createProductPreview,
            "flex justify-center items-center":
              !props.imageSrc && props.createProductPreview,
          }
        )}
      >
        {props.product?.status === "INACTIVE" && (
          <div
            className={cn(`
              absolute
              bottom-0
              right-0
              text-xs
              bg-white
              px-1
              py-1
              rounded-[3px]
              border
              border-primary
              text-primary
              font-medium
            `)}
          >
            Under Review
          </div>
        )}

        {planName && (
          <div
            className={
              "px-4 py-[7px] bg-primary text-white rounded-[3px] absolute top-0 left-0"
            }
          >
            {planName}
          </div>
        )}

        {(!!props?.imageSrc || !props.createProductPreview) && image && (
          <Image
            src={image}
            className={cn("w-full h-full  rounded-[0.625rem]", {
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
              "text-sm sm:text-[0.9375rem] tablet:text-[1rem] sl:text-[1.25rem] font-medium text-grey8"
            }
          >
            Product Photo
          </p>
        )}
      </div>

      <div className={"mt-2 sm:mt-3 flex justify-between"}>
        <Link
          className={cn("flex flex-col gap-y-2", {
            "gap-y-4 mb-4": props.createProductPreview,
            "cursor-pointer": !props.createProductPreview,
          })}
          href={`${DASHBOARD_PRODUCT_ROUTE}/${props.product?.id}`}
          onClick={(e) => {
            if (!props.createProductPreview) return;
            e.preventDefault();
          }}
        >
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
          <p className={"text-primary font-bold text-sm sm:text-base"}>
            {!props?.price && props.createProductPreview
              ? "Product price"
              : discountedAmount}
          </p>
          <p className={"text-xs sm:text-sm text-grey9 max-w-[24ch]"}>
            {!props?.productName && props.createProductPreview
              ? "Product name"
              : props?.productName}
          </p>
          <p
            className={cn("text-[10px] sm:text-xs text-grey6  max-w-[24ch]", {
              "max-w-full": props.createProductPreview,
            })}
          >
            {!props?.description && props.createProductPreview
              ? "Product description"
              : truncateText(props?.description || "", 51)}
          </p>
          <p
            className={
              "flex gap-x-1 items-center text-[10px] sm:text-xs text-grey5 mt-auto"
            }
          >
            <MapPinIcon className="w-1.5 h-1.5 sm:w-3 sm:h-3" />
            {handleLocationDisplay()}
          </p>
        </Link>

        <div
          className={cn("flex justify-end items-end", {
            hidden: props.createProductPreview || !showSaved,
          })}
        >
          <Button
            format={"icon"}
            className={
              "w-6 h-6 sm:w-8 sm:h-8 rounded-full after:hidden bg-offwhite hover:bg-offwhite grid place-items-center"
            }
            onClick={handleSaveProduct}
            disabled={loading}
            aria-label={saved ? "un save product" : "save product"}
          >
            <SavedIcon
              className={"w-4 h-4 sm:w-6 sm:h-6"}
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
