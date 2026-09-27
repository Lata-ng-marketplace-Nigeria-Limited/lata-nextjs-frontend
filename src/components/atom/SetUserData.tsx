"use client";

import { useUser } from "@hooks/useUser";
import { useEffect, useRef } from "react";
import { useFastLocalStore } from "@/store/states/localStore";
import { User } from "@/interface/user";

interface Props {
  user?: User | null;
}
export const SetUserData = ({ user }: Props) => {
  const { updateUser } = useUser();
  const { setSelectedRole } = useFastLocalStore();
  const lastUserRef = useRef<string | null>(null);

  useEffect(() => {
    setSelectedRole(undefined);
  }, [setSelectedRole]);

  useEffect(() => {
    if (!user) return;
    const userString = JSON.stringify({
      id: user.id,
      name: user.name,
      role: user.role,
      balance: user.wallet?.balance,
      isBlocked: user.isBlocked,
    });
    if (lastUserRef.current === userString) return;
    lastUserRef.current = userString;

    (async () => {
      await updateUser(user);
    })();
  }, [updateUser, user]);

  return <></>;
};
