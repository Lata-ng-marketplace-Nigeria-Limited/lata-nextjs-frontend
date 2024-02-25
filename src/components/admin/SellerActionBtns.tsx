"use client";

import React from "react";
import ChangeManager from "./ChangeManager";
import Button from "../atom/Button";
import {
  ADMIN_UPLOAD_PRODUCT_ROUTE,
  DASHBOARD_SUBSCRIPTIONS_ROUTE,
} from "@/constants/routes";
import { useRouter } from "next/navigation";
import { User } from "@/interface/user";
import ResizableDialog from "./ResizableDialog";
import { blockUserApi } from "@/api/auth.client";
import { toast } from "../ui/use-toast";

interface Props {
  managers: User[];
  sellerId: string;
  sellerName: string;
}

const SellerActionBtns = (props: Props) => {
  const { push, refresh } = useRouter();
  const [openModal, setOpenModal] = React.useState(false);
  const [isBlockUser, setIsBlockUser] = React.useState(false);

  const handleBlockUser = async () => {
    try {
      const response = await blockUserApi({ userId: props.sellerId });
      if (response.success) {
        toast({
          title: response.message,
          variant: "success",
        });
        setIsBlockUser(false);
        refresh();
      } else {
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-grey2 p-6">
      <Button
        format="primary"
        className="mb-8 block w-full"
        onClick={() => setOpenModal(!openModal)}
      >
        Change Manager
      </Button>
      <Button
        format="secondary"
        className="mb-8 block w-full"
        // onClick={() => push(DASHBOARD_SUBSCRIPTIONS_ROUTE)}
      >
        Activate Subscription
      </Button>
      <Button
        format="secondary"
        className="mb-8 block w-full"
        onClick={() => push(`${ADMIN_UPLOAD_PRODUCT_ROUTE}/${props?.sellerId}`)}
      >
        Upload Product
      </Button>
      <Button
        format="secondary"
        className="mb-8 block w-full"
        onClick={() => setIsBlockUser(!isBlockUser)}
      >
        Block User
      </Button>
      <Button format="danger" className="mb-8 block w-full">
        Delete Seller
      </Button>

      <ResizableDialog isShown={isBlockUser} setIsShown={setIsBlockUser}>
        <h2 className="mb-2 text-lg font-semibold">
          Block{" "}
          <span className="text-lg font-semibold text-primary">
            {props.sellerName || "User"}
          </span>
        </h2>
        <p className="mb-2">
          You are about to block {props.sellerName || "this user"}. Their account
          will remain inactive until they are unblocked. Click on "Block" to
          Proceed
        </p>
        <div className="flex items-center justify-end gap-5">
          <Button format="secondary" onClick={() => setIsBlockUser(false)}>
            Cancel
          </Button>
          <Button
            format="danger"
            className="bg-danger text-white hover:bg-danger hover:text-white"
            onClick={handleBlockUser}
          >
            Block
          </Button>
        </div>
      </ResizableDialog>

      <ResizableDialog isShown={openModal} setIsShown={setOpenModal}>
        <ChangeManager
          sellerId={props.sellerId}
          managers={props.managers}
          setOpenModal={setOpenModal}
        />
      </ResizableDialog>
    </div>
  );
};

export default SellerActionBtns;
