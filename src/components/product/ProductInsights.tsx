"use client";
import { Product } from "@/interface/products";
import { useUser } from "@hooks/useUser";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@components/ui/use-toast";
import {
  DASHBOARD_MY_SHOP_ROUTE,
  DASHBOARD_PRODUCT_EDIT_ROUTE,
} from "@/constants/routes";
import { deleteAProductApi } from "@/api/product";
import ProductAsideArea from "@atom/ProductAsideArea";
import MobileBorderArea from "@atom/MobileBorderArea";
import { cn } from "@/utils";
import Button from "@atom/Button";
import HeaderText from "@atom/HeaderText";
import Hr from "@atom/Hr";
import ProductInsightInfo from "@components/product/ProductInsightInfo";
import { EyeIcon } from "@atom/icons/Eye";
import { SavedIcon } from "@atom/icons/Saved";
import { ProfileIcon } from "@atom/icons/Profile";
import { CallIcon } from "../atom/icons/Call";

interface Props {
  product?: Product;
}

export default function ProductInsights(props: Props) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { push: nav } = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!props.product?.id) return;
    setLoading(true);
    try {
      await deleteAProductApi(props.product?.id || "");
      toast({
        title: "Product deleted successfully",
        variant: "success",
      });
      nav(DASHBOARD_MY_SHOP_ROUTE);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
      });
    }
  };

  return (
    <ProductAsideArea>
      <MobileBorderArea
        className={cn(
          `
            px-[10px]
            py-6
            sm:px-[43px]
            h-max
          `
        )}
        showBorderInDesktop
      >
        <div className={"flex flex-col gap-y-3 md:gap-y-6 mb-3"}>
          <HeaderText>Product insights</HeaderText>
          <Hr className={"border-grey2"} />
        </div>

        <div className={"flex flex-col gap-y-3"}>
          <ProductInsightInfo
            icon={<EyeIcon />}
            title={"Views"}
            count={props.product?.views || 0}
          />
          <ProductInsightInfo
            icon={
              <SavedIcon
                className={"w-7 h-7"}
                pathClass={"fill-primary stroke-primary"}
              />
            }
            title={"Saved"}
            count={props.product?.saved || 0}
          />
          <ProductInsightInfo
            icon={<CallIcon />}
            title={"Call clicks"}
            count={props?.product?.phoneClicks || 0}
          />
          <ProductInsightInfo
            icon={<ProfileIcon />}
            title={"Profile visit"}
            count={user?.profileViews || 0}
          />
        </div>
      </MobileBorderArea>

      {props.product?.status !== "CANCELLED" ||
      user?.email.includes("rnwonder") ? (
        <MobileBorderArea
          className={"flex h-fit flex-col px-2.5 py-6 sm:px-6"}
          showBorderInDesktop
        >
          <Button
            className={"w-full"}
            format={"primary"}
            onClick={() => {
              nav(DASHBOARD_PRODUCT_EDIT_ROUTE + "/" + props.product?.id);
            }}
          >
            Edit product
          </Button>
        </MobileBorderArea>
      ) : null}

      <MobileBorderArea
        className={"flex h-fit flex-col px-2.5 py-6 sm:px-6"}
        showBorderInDesktop
      >
        <Button
          disabled={loading}
          onClick={handleDelete}
          className={"w-full"}
          format={"danger"}
        >
          Delete
        </Button>
      </MobileBorderArea>

      {props.product?.status === "INACTIVE" ? (
        <MobileBorderArea
          className={"flex h-fit flex-col px-2.5 py-6 sm:px-6"}
          showBorderInDesktop
        >
          <p className={"text-sm tablet:text-base font-medium"}>Under Review</p>
        </MobileBorderArea>
      ) : null}

      {props.product?.status === "CANCELLED" ? (
        <MobileBorderArea
          className={"flex h-fit flex-col px-2.5 py-6 sm:px-6 bg-danger"}
          showBorderInDesktop
        >
          <p className={"text-sm tablet:text-base font-bold text-white"}>
            Product Rejected
          </p>
        </MobileBorderArea>
      ) : null}
    </ProductAsideArea>
  );
}
