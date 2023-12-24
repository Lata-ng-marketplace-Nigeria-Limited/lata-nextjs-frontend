import { findAllNotificationsApi } from "@/api/notifications";
import { NotificationArea } from "@components/notifications/NotificationArea";

interface Props {
  page?: string;
}

export const NotificationWrapper = async ({ page }: Props) => {
  const data = await findAllNotificationsApi({
    page,
  });

  return (
    <div className={"h-full relative"}>
      <NotificationArea notifications={data.data} meta={data.meta} />
    </div>
  );
};
