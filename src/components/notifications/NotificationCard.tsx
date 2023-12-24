import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Notification } from "@/interface/Notification";
import { readNotificationApi } from "@/api/notifications";
import { cn, getTimeFromNow } from "@/utils";
import Image from "next/image";
import { DateTime } from "luxon";
import Modal from "@molecule/Modal";
import SendSellerMessage from "@components/input/SendSellerMessage";

interface Props {
  notification: Notification;
  loading: boolean;
}

export default function NotificationCard(props: Props) {
  const [showModal, setShowModal] = useState(false);
  const [allowClick, setAllowClick] = useState(true);
  const { push: nav } = useRouter();

  useEffect(() => {
    if (showModal) {
      setAllowClick(false);
    } else {
      setTimeout(() => {
        setAllowClick(true);
      }, 500);
    }
  }, [showModal]);

  const handleClick = async () => {
    if (!allowClick) return;
    if (props.loading) return;

    if (!props.notification.isRead) {
      try {
        await readNotificationApi(props.notification.id);

        if (props.notification.data.action !== "NAVIGATE") {
          // revalidatePath("/notifications");
        }
        if (props.notification.data.action === "MODAL") {
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }

    switch (props.notification.data.action) {
      case "NAVIGATE":
        props.notification?.data?.url && nav(props.notification.data.url);
        break;
      case "OPEN_URL":
        props.notification?.data?.url &&
          window.open(props.notification.data.url, "_blank");
        break;
      case "MODAL":
        handleModal();
        break;
      case "NONE":
        break;
      default:
        break;
    }
  };

  const handleModal = () => {
    switch (props.notification.data.modal) {
      case "PRODUCT_VIEW":
        setShowModal(true);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={cn(`
        flex
        items-center
        gap-x-3
        p-3
        sm:p-6
        cursor-pointer
    `)}
      onClick={handleClick}
    >
      {props.notification?.data?.image ? (
        <div className={cn(`w-[50px] h-[50px] rounded-full shrink-0`)}>
          <Image
            className={cn(`w-full h-full rounded-full`)}
            src={props.notification?.data?.image}
            alt={props.notification?.data?.title || "Notification"}
            width={50}
            height={50}
          />
        </div>
      ) : null}

      <div
        className={cn(`flex-col flex gap-y-2.5 `, {
          "font-semibold": !props.notification.isRead,
        })}
      >
        <p className={"text-xs sm:text-sm text-grey8"}>
          {props.notification.message}
        </p>
        <p className={"text-[8px] sm:text-[10px] text-grey7"}>
          {getTimeFromNow(props.notification.createdAt)} ago |{" "}
          {DateTime.fromISO(props.notification.createdAt).toLocaleString(
            DateTime.DATETIME_MED,
          )}
        </p>
      </div>

      <Modal
        isShown={showModal}
        contentClass={cn(
          `w-full xls:w-fit xls:min-w-[350px] xs:min-w-[400px] sm:min-w-[500px]`,
        )}
        setIsShown={setShowModal}
      >
        <div className={""}>
          <h3 className={"text-sm sm:text-base font-semibold text-grey10"}>
            User Information
          </h3>

          <div className={"flex flex-col gap-y-6 mt-8"}>
            <div className={"text-xs sm:text-sm"}>
              <span className={"font-medium"}>Name: </span>
              <span>{props.notification?.data?.name}</span>
            </div>
            <div className={"text-xs sm:text-sm"}>
              <span className={"font-medium"}>Email: </span>
              <span>{props.notification?.data?.email}</span>
            </div>

            {props.notification?.data?.phoneNumber ? (
              <div className={"text-xs sm:text-sm"}>
                <span className={"font-medium"}>Phone: </span>
                <span>{props.notification?.data?.phoneNumber}</span>
              </div>
            ) : null}

            <SendSellerMessage
              productId={props.notification?.data?.productId}
              buyerId={props.notification?.data?.userId}
              hideCancel
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
