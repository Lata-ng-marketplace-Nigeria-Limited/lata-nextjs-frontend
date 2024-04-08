"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "../atom/Button";
import { blockUserApi } from "@/api/admin.client";
import { showToast } from "@/utils";
import ResizableDialog from "../admin/ResizableDialog";

interface Props {
  userId: string;
  name: string;
  managerId: string;
  isBlocked: boolean;
}

const BlockOrUnblockAccount = (props: Props) => {
  const { refresh } = useRouter();
  const [showModal, setShowModal] = React.useState(false);

  const onBlockOrUnblockUser = async () => {
    try {
      const blockUserPayload = {
        userId: props.userId,
        block: !props.isBlocked,
        managerId: props.managerId,
      };

      const response = await blockUserApi(blockUserPayload);
      setShowModal(false);
      refresh();
      showToast(response?.message, "success");
    } catch (error) {
      console.log(error);
      showToast("Something went wrong", "destructive");
    }
  };

  return (
    <div>
      <Button
        format="secondary"
        className="mb-8 block w-full"
        onClick={() => setShowModal(!showModal)}
      >
        {props.isBlocked ? "Unblock" : "Block"} User
      </Button>

      <ResizableDialog isShown={showModal} setIsShown={setShowModal}>
        <h2 className="mb-2 text-lg font-semibold">
          {props.isBlocked ? "Unblock" : "Block"}{" "}
          <span className="text-lg font-semibold text-primary">
            {props.name || "User"}
          </span>
        </h2>
        <p className="mb-4">
          {`By ${
            props.isBlocked ? "unblock" : "block"
          }ing this user, their account will ${
            props.isBlocked
              ? "be unblocked, and all restrictions placed on their account will be lifted!"
              : "be temporarily suspended, and they won’t be able to access the platform."
          } Please click "${
            props.isBlocked ? "Unblock" : "Block"
          }" to proceed with this action.`}
        </p>
        <div className="flex items-center justify-end gap-5">
          <Button format="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            format="danger"
            className="bg-danger text-white hover:bg-danger hover:text-white"
            onClick={onBlockOrUnblockUser}
          >
            {props.isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      </ResizableDialog>
    </div>
  );
};

export default BlockOrUnblockAccount;
