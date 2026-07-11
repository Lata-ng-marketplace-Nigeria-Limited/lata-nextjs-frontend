import { User } from "@/interface/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DASHBOARD_SELLER_PROFILE_ROUTE } from "@/constants/routes";
import { cn, formatNigerianPhoneNumber, makePhoneCall } from "@/utils";
import { useToast } from "@components/ui/use-toast";
import MobileBorderArea from "@atom/MobileBorderArea";
import AppAvatar from "@molecule/Avatar";
import Button from "@atom/Button";
import SendMessage from "@/components/input/SendMessage";
import { generateSellerAnalyticsApi } from "@/api/view";
import useGetSwitchedRolesQueries from "@/hooks/useGetSwitchedRolesQueries";

interface Props {
  type: "compact" | "expanded";
  sellerInfo?: User | null;
  productName?: string;
  productId?: string;
  productOwnerId?: string;
  sellerRole?: string;
}

const getDisplayRole = (user?: User | null) => {
  if (!user) return "";
  if (user.role === "BUYER" && user.buyerRole) {
    switch (user.buyerRole) {
      case "direct_buyer":
        return "Direct Buyer";
      case "direct_mandate":
        return "Direct Mandate";
      case "agent":
        return "Agent";
      default:
        return user.buyerRole.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    }
  }
  return user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
};

const getDisplaySellerRole = (role?: string) => {
  if (!role) return "";
  switch (role) {
    case "owner":
      return "Owner";
    case "direct_mandate":
      return "Direct Mandate";
    case "agent":
      return "Agent";
    case "reseller":
      return "Reseller";
    case "freelancer":
      return "Freelancer";
    default:
      return role.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }
};

export default function SellerContact(props: Props) {
  const [typeMessage, setTypeMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const { push: nav } = useRouter();
  const { toast } = useToast();

  const switchedRolesQueries = useGetSwitchedRolesQueries();

  const handleSendMessage = () => {
    setTypeMessage(true);
  };

  const handleGoToProfile = () => {
    if (props.type === "compact") {
      nav(
        `${DASHBOARD_SELLER_PROFILE_ROUTE}/${props.sellerInfo?.id}?pid=${props.productId}`
      );
    }
  };

  const handleOtherContactMethod = async (type: "whatsApp" | "phone") => {
    const formatNo = formatNigerianPhoneNumber(
      props.sellerInfo?.phoneNumber || "0"
    );
    if (!formatNo) {
      return toast({
        title: "Seller's phone number is not available",
        description: "Please try other means of contacting the seller.",
        variant: "info",
      });
    }

    if (type === "whatsApp") {
      await generateSellerAnalyticsApi(
        "MESSAGE",
        props.productId || "",
        props.productOwnerId || "",
        switchedRolesQueries
      );
      window.open(
        `https://wa.me/${formatNo}?text=${window.location.origin}/product/${props.productId}%0A%0A%0AHi, I'm interested in this product on Lata.ng!`,
        "_blank"
      );
    } else {
      await generateSellerAnalyticsApi(
        "PHONE",
        props.productId || "",
        props.productOwnerId || "",
        switchedRolesQueries
      );
      makePhoneCall(formatNo);
    }
  };

  return (
    <MobileBorderArea
      className={cn(
        `
      px-[10px]
      py-6
      
      sm:px-[20px]
      h-max
      
      `,
        {
          "tablet:py-8 tablet:px-[20px]  lg:px-[30px] xlg:px-[60px]":
            props.type === "expanded",
        }
      )}
      showBorderInDesktop
    >
      <div
        className={cn("flex items-center gap-x-2.5 mb-6", {
          "cursor-pointer": props.type === "compact",
        })}
        onClick={handleGoToProfile}
      >
        <AppAvatar
          src={props.sellerInfo?.avatar}
          name={props.sellerInfo?.name}
          className={cn(
            `
            w-[3.75rem]
            h-[3.75rem]
            
            sm:w-[3.75rem]
            sm:h-[3.75rem]
            
            tablet:w-[6.25rem]
            tablet:h-[6.25rem]
          `,
            {
              [`
                sm:w-[6.75rem]
                sm:h-[6.75rem]
                tablet:w-[9.375rem]
                tablet:h-[9.375rem]
                
              `]: props.type === "expanded",
            }
          )}
        />

        <div>
          <p className={"font-bold text-black"}>
            {props.sellerInfo?.name}
          </p>
          {(props.sellerRole || props.sellerInfo?.role) && (
            <p className={"text-xs font-semibold text-primary/90 mt-0.5 mb-1 bg-primary/10 px-2.5 py-0.5 rounded-full w-max"}>
              {props.sellerRole ? getDisplaySellerRole(props.sellerRole) : getDisplayRole(props.sellerInfo)}
            </p>
          )}
          <p className={"text-xs text-grey9"}>
            {props.sellerInfo?.phoneNumber}
          </p>
        </div>
      </div>

      <div className={"flex flex-col gap-y-3"}>
        <Button
          format={"primary"}
          onClick={() => handleOtherContactMethod("whatsApp")}
        >
          WhatsApp Seller
        </Button>
        <Button
          format={"secondary"}
          onClick={() => handleOtherContactMethod("phone")}
        >
          Call Seller
        </Button>

        {!typeMessage ? (
          <Button
            format={"secondary"}
            disabled={messageSent}
            onClick={handleSendMessage}
          >
            Send message to seller
          </Button>
        ) : (
          <SendMessage
            sellerInfo={props.sellerInfo}
            setTypeMessage={setTypeMessage}
            productId={props.productId}
            setMessageSent={setMessageSent}
            productOwnerId={props.productOwnerId}
          />
        )}
      </div>
    </MobileBorderArea>
  );
}
