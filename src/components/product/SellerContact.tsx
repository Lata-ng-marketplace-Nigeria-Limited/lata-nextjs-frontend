import { User } from "@/interface/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DASHBOARD_SELLER_PROFILE_ROUTE } from "@/constants/routes";
import { cn, formatNigerianPhoneNumber, makePhoneCall } from "@/utils";
import { useToast } from "@components/ui/use-toast";
import MobileBorderArea from "@atom/MobileBorderArea";
import AppAvatar from "@molecule/Avatar";
import Button from "@atom/Button";
import SendSellerMessage from "@components/input/SendSellerMessage";
import { generateSellerAnalyticsApi } from "@/api/view";

interface Props {
  type: "compact" | "expanded";
  sellerInfo?: User | null;
  productName?: string;
  productId?: string;
  productOwnerId?: string;
}

export default function SellerContact(props: Props) {
  const [typeMessage, setTypeMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const { push: nav } = useRouter();
  const { toast } = useToast();

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
        props.productOwnerId || ""
      );
      window.open(
        `https://wa.me/${formatNo}?text=${window.location.origin}/product/${props.productId}%0A%0A%0AHi, I'm interested in this product on Lata.ng!`,
        "_blank"
      );
    } else {
      await generateSellerAnalyticsApi(
        "PHONE",
        props.productId || "",
        props.productOwnerId || ""
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
          <p className={"font-bold mb-2 text-black"}>
            {props.sellerInfo?.name}
          </p>
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
          <SendSellerMessage
            sellerInfo={props.sellerInfo}
            setTypeMessage={setTypeMessage}
            productId={props.productId}
            setMessageSent={setMessageSent}
          />
        )}
      </div>
    </MobileBorderArea>
  );
}
