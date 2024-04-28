import {
  IFindAllNotificationsApiQueries,
  findAllNotificationsApi,
} from "@/api/notifications";
import { NotificationArea } from "@components/notifications/NotificationArea";

interface Props {
  queries: IFindAllNotificationsApiQueries;
}

export const NotificationWrapper = async ({ queries }: Props) => {
  const data = await findAllNotificationsApi(queries);

  return (
    <div className={"relative h-full"}>
      <NotificationArea notifications={data.data} meta={data.meta} />
    </div>
  );
};
