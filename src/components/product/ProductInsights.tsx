"use client";
import { Product } from "@/interface/products";
import { useUser } from "@hooks/useUser";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@components/ui/use-toast";
import {
  DASHBOARD_MY_SHOP_ROUTE,
  DASHBOARD_PRODUCT_EDIT_ROUTE,
} from "@/constants/routes";
import { deleteAProductApi } from "@/api/product";
import ProductAsideArea from "@atom/ProductAsideArea";
import MobileBorderArea from "@atom/MobileBorderArea";
import { cn, safeParseJSON } from "@/utils";
import Button from "@atom/Button";
import HeaderText from "@atom/HeaderText";
import Hr from "@atom/Hr";
import ProductInsightInfo from "@components/product/ProductInsightInfo";
import { EyeIcon } from "@atom/icons/Eye";
import { SavedIcon } from "@atom/icons/Saved";
import { ProfileIcon } from "@atom/icons/Profile";
import { CallIcon } from "../atom/icons/Call";
import useGetSwitchedRolesQueries from "@/hooks/useGetSwitchedRolesQueries";
import { Sparkles, CheckCircle2 } from "lucide-react";
import PromotePostModal from "@components/modals/PromotePostModal";
import { DateTime } from "luxon";

interface Props {
  product?: Product;
}

function getPromotionTimeDetails(
  promotionExpiresAt?: string | null,
  promotionStartedAt?: string | null,
  createdAt?: string | null
) {
  const expiryRaw = promotionExpiresAt;
  if (!expiryRaw) return null;

  let expiryDt = DateTime.fromISO(expiryRaw);
  if (!expiryDt.isValid) expiryDt = DateTime.fromSQL(expiryRaw);
  if (!expiryDt.isValid) {
    const jsDate = new Date(expiryRaw);
    if (!isNaN(jsDate.getTime())) expiryDt = DateTime.fromJSDate(jsDate);
  }
  if (!expiryDt.isValid) return null;

  const now = DateTime.now();
  const diffDays = Math.ceil(expiryDt.diff(now, "days").days);
  const diffHours = Math.ceil(expiryDt.diff(now, "hours").hours);

  let remainingText = "";
  if (diffDays > 1) {
    remainingText = `${diffDays} days left`;
  } else if (diffDays === 1) {
    remainingText = "1 day left";
  } else if (diffHours > 0) {
    remainingText = `${diffHours} hour${diffHours > 1 ? "s" : ""} left`;
  } else {
    remainingText = "Expired";
  }

  const finishDateFormatted = expiryDt.toFormat("dd LLL yyyy, h:mm a");

  let startDateFormatted: string | null = null;
  const startRaw = promotionStartedAt || createdAt;
  if (startRaw) {
    let startDt = DateTime.fromISO(startRaw);
    if (!startDt.isValid) startDt = DateTime.fromSQL(startRaw);
    if (!startDt.isValid) {
      const jsDate = new Date(startRaw);
      if (!isNaN(jsDate.getTime())) startDt = DateTime.fromJSDate(jsDate);
    }
    if (startDt.isValid) {
      startDateFormatted = startDt.toFormat("dd LLL yyyy, h:mm a");
    }
  }

  return {
    remainingText,
    finishDateFormatted,
    startDateFormatted,
  };
}

export default function ProductInsights(props: Props) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const { push: nav } = useRouter();
  const { toast } = useToast();

  const queries = useGetSwitchedRolesQueries();

  const handleDelete = async () => {
    if (!props.product?.id) return;
    setLoading(true);
    try {
      await deleteAProductApi(props.product?.id || "", queries);
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

  const metaObj = safeParseJSON(props.product?.meta || "{}");
  const expiryRaw = props.product?.promotionExpiresAt || metaObj?.promotionExpiresAt;
  const startRaw = metaObj?.promotionStartedAt || props.product?.createdAt;

  const isPromoted = Boolean(
    props.product?.isPromoted ||
    metaObj?.isPromoted ||
    props.product?.promotionType === "MINI" ||
    props.product?.promotionType === "Mini" ||
    (expiryRaw && new Date(expiryRaw) > new Date())
  );

  const promoTime = getPromotionTimeDetails(expiryRaw, startRaw, props.product?.createdAt);

  return (
    <ProductAsideArea>
      <MobileBorderArea
        className={cn(
          `
            h-max
            px-[10px]
            py-6
            sm:px-[43px]
          `,
        )}
        showBorderInDesktop
      >
        <div className={"mb-3 flex flex-col gap-y-3 md:gap-y-6"}>
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
                className={"h-7 w-7"}
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

      {props.product?.status || user?.email.includes("rnwonder") ? (
        <MobileBorderArea
          className={"flex h-fit flex-col gap-y-3 px-2.5 py-6 sm:px-6"}
          showBorderInDesktop
        >
          {isPromoted && (
            <div className="flex flex-col gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">
                    Promotion Active ({props.product?.promotionType || metaObj?.promotionType || "Mini"})
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Boosted Post Visibility
                  </p>
                </div>
              </div>

              {promoTime && (
                <div className="mt-1 pt-2 border-t border-emerald-200/80 flex flex-col gap-1.5 text-[11px] text-emerald-900">
                  {promoTime.startDateFormatted && (
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-700 font-medium">Started:</span>
                      <span className="font-semibold">{promoTime.startDateFormatted}</span>
                    </div>
                  )}
                  {promoTime.finishDateFormatted && (
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-700 font-medium">Finishing:</span>
                      <span className="font-semibold">{promoTime.finishDateFormatted}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-emerald-700 font-medium">Time Left:</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200/80 text-emerald-900">
                      {promoTime.remainingText}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          <Button
            className={`w-full flex items-center justify-center gap-2 ${isPromoted ? "!bg-emerald-600 hover:!bg-emerald-700 !text-white" : ""}`}
            format={isPromoted ? "secondary" : "primary"}
            onClick={() => {
              setShowPromoteModal(true);
            }}
          >
            {isPromoted ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {isPromoted ? "Extend Promotion" : "Promote Post"}
          </Button>
          <Button
            className={"w-full"}
            format={"secondary"}
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
          <p className={"text-sm font-medium tablet:text-base"}>Under Review</p>
        </MobileBorderArea>
      ) : null}

      {props.product?.status === "CANCELLED" ? (
        <MobileBorderArea
          className={"flex h-fit flex-col bg-danger px-2.5 py-6 sm:px-6"}
          showBorderInDesktop
        >
          <p className={"text-sm font-bold text-white tablet:text-base"}>
            Product Rejected
          </p>
        </MobileBorderArea>
      ) : null}

      {showPromoteModal && props.product?.id && (
        <PromotePostModal
          isOpen={showPromoteModal}
          productId={props.product.id}
          productName={props.product.name}
          isAlreadyPromoted={isPromoted}
          onClose={() => setShowPromoteModal(false)}
        />
      )}
    </ProductAsideArea>
  );
}
