import { useLocalStore } from "@/store/states/localStore";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { getUserFromAuthCallback, logoutUser, setCookies } from "@/utils";
import { User } from "@/interface/user";
import { authCallbackApi } from "@/api/auth";
import { Plan } from "@/interface/payment";
import { SessionData } from "@/interface/next-auth";
import { useUserStore } from "@/store/states/userState";
import { redirect, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export const useUser = () => {
  const { user, updateUser, clear, setUser } = useLocalStore();
  const [activePlan, setActivePlan] = useState<Plan>();
  const { data, status, update } = useSession();
  const isSocketConnected = useUserStore((state) => state.isSocketConnected);
  const { replace, push } = useRouter();

  useEffect(() => {
    if (user?.subscriptionStatus === "ACTIVE" && user?.plan) {
      setActivePlan(user.plan);
    }

    if (
      (user && new Date() > new Date(user?.expires_at)) ||
      (user && !user?.expires_at)
    ) {
      logoutUser(clear, true);
    }
  }, [user?.plan, user?.subscriptionStatus]);

  const handleUpdate = useCallback(
    async (userData: User, token?: string) => {
      let dataToUpdate: SessionData = {};
      if (data && data?.user?.name !== userData.name) {
        dataToUpdate = {
          ...data,
          user: {
            ...(data?.user as any),
            name: userData.name,
          },
        };
      }

      if (data && data?.role !== userData.role) {
        dataToUpdate = {
          ...data,
          ...dataToUpdate,
          role: userData.role,
          user: {
            ...(data?.user as any),
            ...dataToUpdate,
            role: userData.role,
          },
        };
      }

      if (
        data &&
        userData?.wallet &&
        data?.wallet?.balance !== userData?.wallet?.balance
      ) {
        dataToUpdate = {
          ...(data as any),
          ...dataToUpdate,
          wallet: userData?.wallet as any,
        };
      }

      if (data && token && data?.token !== token) {
        dataToUpdate = {
          ...(data as any),
          ...dataToUpdate,
          token,
        };
      }

      if (Object.keys(dataToUpdate).length) {
        await update(dataToUpdate);
      }
      updateUser(userData);
    },
    [data, update, updateUser],
  );

  const loginUser = useCallback(
    async (publicToken: string, isUpgrading?: boolean) => {
      try {
        const authCallback = await authCallbackApi(publicToken);

        if (!authCallback) {
          return {
            error: true,
            message: "Something went wrong",
          }
        }


        if (isUpgrading) {
          setUser(getUserFromAuthCallback(authCallback));
          await handleUpdate(
            getUserFromAuthCallback(authCallback),
            authCallback?.token,
          );
          setCookies("token", authCallback?.token, {
            isoDate: authCallback?.expires_at,
          });
          replace("/");
          return {
            error: false,
            message: "Success",
          } 
        }

        if (authCallback.isBlocked) {
          toast({
            title: "Account Locked",
            description:
              "You have been temporarily locked. Please fill out the form on the redirected page to unlock your account.",
            variant: "destructive",
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
          push("/blocked");
          return;
        }

        setUser(getUserFromAuthCallback(authCallback));
        setCookies("token", authCallback?.token, {
          isoDate: authCallback?.expires_at,
        });

        await signIn("credentials", {
          publicToken,
        });

        return {
          error: false,
          message: "Success",
        };
      } catch (error) {
        return {
          error: true,
          message: "Something went wrong",
        };
      }
    },
    [handleUpdate, replace, setUser],
  );

  return {
    user,
    updateUser: handleUpdate,
    clear,
    isLoggedIn: status === "authenticated",
    role: user?.role,
    loginUser,
    activePlan,
    isSocketConnected,
  };
};
