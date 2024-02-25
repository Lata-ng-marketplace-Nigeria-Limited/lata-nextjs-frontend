"use client";

import React from "react";
import ChangeManager from "./ChangeManager";
import Button from "../atom/Button";
import { ADMIN_UPLOAD_PRODUCT_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { User } from "@/interface/user";
import ResizableDialog from "./ResizableDialog";
import BlockUser from "./BlockUser";

interface Props {
  managers: User[];
  sellerId: string;
  sellerName: string;
}

const SellerActionBtns = (props: Props) => {
  const { push } = useRouter();
  const [openModal, setOpenModal] = React.useState(false);
  const [isBlockUser, setIsBlockUser] = React.useState(false);

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
        <BlockUser setIsBlockUser={setIsBlockUser} userId={props.sellerId} />
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
