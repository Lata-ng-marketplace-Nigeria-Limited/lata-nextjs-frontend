"use client";

import React from "react";
import ChangeManager from "./ChangeManager";
import Button from "../atom/Button";
import { DASHBOARD_SUBSCRIPTIONS_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { User } from "@/interface/user";
import { changeManagerApi } from "@/api/auth.client";
import ResizableDialog from "./ResizableDialog";

interface Props {
  managers: User[];
  sellerId: string;
}

const SellerActionBtns = (props: Props) => {
  const { push } = useRouter();
  const [openModal, setOpenModal] = React.useState(false);

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
        onClick={() => push(DASHBOARD_SUBSCRIPTIONS_ROUTE)}
      >
        Activate Subscription
      </Button>
      <Button format="secondary" className="mb-8 block w-full">
        Upload Product
      </Button>
      <Button format="secondary" className="mb-8 block w-full">
        Block User
      </Button>
      <Button format="danger" className="mb-8 block w-full">
        Delete Seller
      </Button>

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
