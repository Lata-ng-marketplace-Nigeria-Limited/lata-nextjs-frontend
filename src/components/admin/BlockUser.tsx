import React from "react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Button from "../atom/Button";
import { blockUserApi } from "@/api/admin.client";
import { useBlockedUser } from "@/store/states/localStore";

interface Props {
  userId: string;
  name: string;
  setIsBlockUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const BlockUser = (props: Props) => {
  const { refresh } = useRouter();
  const { hasBlockedUser, unblockUser, setBlockUser } = useBlockedUser();

  const toaster = (response: { message: string; success: boolean }) => {
    if (response.success) {
      toast({
        title: response.message,
        variant: "success",
      });
      props.setIsBlockUser(false);
      refresh();
    } else {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const onBlockUser = async () => {
    try {
      const blockUserPayload = {
        userId: props.userId,
        block: true,
      };
      const response = await blockUserApi(blockUserPayload);
      setBlockUser();
      toaster(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onUnblockUser = async () => {
    try {
      const unBlockUserPayload = {
        userId: props.userId,
        block: false,
      };
      const response = await blockUserApi(unBlockUserPayload);
      unblockUser();
      toaster(response);
    } catch (error) {}
  };

  const handleBlockUser = () => {
    if (hasBlockedUser) {
      onUnblockUser();
    } else {
      onBlockUser();
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">
        {hasBlockedUser ? "Unblock" : "Block"}{" "}
        <span className="text-lg font-semibold text-primary">
          {props.name || "User"}
        </span>
      </h2>
      <p className="mb-4">
        {`By ${
          hasBlockedUser ? "unblock" : "block"
        }ing this user, their account will ${
          hasBlockedUser
            ? "be unblocked, and all restrictions placed on their account will be lifted!"
            : "be temporarily suspended, and they won’t be able to access the platform."
        } Please click "${
          hasBlockedUser ? "Unblock" : "Block"
        }" to proceed with this action.`}
      </p>
      <div className="flex items-center justify-end gap-5">
        <Button format="secondary" onClick={() => props.setIsBlockUser(false)}>
          Cancel
        </Button>
        <Button
          format="danger"
          className="bg-danger text-white hover:bg-danger hover:text-white"
          onClick={handleBlockUser}
        >
          {hasBlockedUser ? "Unblock" : "Block"}
        </Button>
      </div>
    </div>
  );
};

export default BlockUser;
