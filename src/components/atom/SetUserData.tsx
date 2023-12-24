"use client";

import { useUser } from "@hooks/useUser";
import { useEffect } from "react";
import { useFastLocalStore } from "@/store/states/localStore";
import { User } from "@/interface/user";

interface Props {
  user?: User | null;
}
export const SetUserData = ({ user }: Props) => {
  const { updateUser } = useUser();
  const { setSelectedRole } = useFastLocalStore();

  useEffect(() => {
    setSelectedRole(undefined);
  }, [setSelectedRole]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      await updateUser(user);
    })();
  }, [updateUser, user]);

  return <></>;
};
