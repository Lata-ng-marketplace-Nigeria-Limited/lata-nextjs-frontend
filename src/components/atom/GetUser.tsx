import { SetUserData } from "@atom/SetUserData";
import { getUserLatestDataApi } from "@/api/auth";
import { unstable_noStore } from "next/cache";

export const GetUser = async () => {
  unstable_noStore();
  const user = await getUserLatestDataApi();
  return <SetUserData user={user} />;
};
