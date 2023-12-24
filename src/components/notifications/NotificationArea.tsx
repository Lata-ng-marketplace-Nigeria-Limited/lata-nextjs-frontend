"use client";
import HeaderText from "@atom/HeaderText";
import Button from "@atom/Button";
import { useState } from "react";
import { readAllNotificationApi } from "@/api/notifications";
import { useToast } from "@components/ui/use-toast";
import { revalidatePath } from "next/cache";
import { FetchMeta } from "@/interface/general";
import MobileBorderArea from "@atom/MobileBorderArea";
import { cn } from "@/utils";
import NotificationCard from "@components/notifications/NotificationCard";
import { Notification } from "@/interface/Notification";
import Paginate from "@components/input/Paginate";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  notifications: Notification[];
  meta: FetchMeta;
}
export const NotificationArea = ({ notifications, meta }: Props) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await readAllNotificationApi();
      toast({
        description: "All notifications marked as read",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (toPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", toPage + "");
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <>
      <div className={"flex justify-between items-center max-w-[791px]"}>
        <HeaderText title>Notifications</HeaderText>

        <Button
          format={"tertiary"}
          disabled={loading}
          className={
            "px-0 text-sm tablet:text-base font-semibold sm:px-0 hover:bg-transparent active:bg-transparent "
          }
          onClick={handleMarkAllAsRead}
        >
          Mark all as read
        </Button>
      </div>

      <MobileBorderArea
        showBorderInDesktop
        className={cn(`py-3 sm:py-0 w-full max-w-[791px] h-max mt-4`)}
        removePadding
      >
        {notifications.map((notif, i) => (
          <NotificationCard loading={loading} notification={notif} key={i} />
        ))}

        {meta.last_page > 1 ? (
          <Paginate
            currentPage={Number(searchParams.get("page") || 1)}
            meta={meta}
            loading={loading}
            onPageChange={handlePageChange}
          />
        ) : null}
      </MobileBorderArea>
    </>
  );
};
