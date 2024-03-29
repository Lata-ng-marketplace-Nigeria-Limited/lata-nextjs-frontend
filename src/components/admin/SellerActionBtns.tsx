"use client";

import React from "react";
import ChangeManager from "./ChangeManager";
import Button from "../atom/Button";
import {
  ADMIN_UPLOAD_PRODUCT_ROUTE,
  ADMIN_VERIFY_TRANSFERS_ROUTE,
} from "@/constants/routes";
import { useRouter } from "next/navigation";
import { User } from "@/interface/user";
import ResizableDialog from "./ResizableDialog";
import BlockUser from "../blocked-accounts/BlockUser";
import DeleteUser from "./DeleteUser";
import { useBlockedUser } from "@/store/states/localStore";
import { useUser } from "@/hooks/useUser";
import { IGetProtectedSellerApi } from "@/api/admin";

interface Props {
  managers: User[];
  seller: IGetProtectedSellerApi["data"];
}

const SellerActionBtns = (props: Props) => {
  const { push } = useRouter();
  const [openModal, setOpenModal] = React.useState(false);
  const [isBlockUser, setIsBlockUser] = React.useState(false);
  const [isDeleteUserModal, setIsDeleteUserModal] = React.useState(false);
  const { hasBlockedUser } = useBlockedUser();
  const { user } = useUser();

  return (
    <div className="mb-6 rounded-xl border border-grey2 p-6">
      {user?.role === "ADMIN" ? (
        <>
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
            onClick={() => push(ADMIN_VERIFY_TRANSFERS_ROUTE)}
          >
            Activate Subscription
          </Button>
          <Button
            format="secondary"
            className="mb-8 block w-full"
            onClick={() =>
              push(`${ADMIN_UPLOAD_PRODUCT_ROUTE}/${props?.seller?.id}`)
            }
          >
            Upload Product
          </Button>
          <Button
            format="secondary"
            className="mb-8 block w-full"
            onClick={() => setIsBlockUser(!isBlockUser)}
          >
            {hasBlockedUser ? "Unblock" : "Block"} User
          </Button>
          <Button
            format="danger"
            className="mb-8 block w-full"
            onClick={() => setIsDeleteUserModal(true)}
          >
            Delete Seller
          </Button>
        </>
      ) : (
        <Button
          format="secondary"
          className="mb-8 block w-full"
          onClick={() =>
            push(`${ADMIN_UPLOAD_PRODUCT_ROUTE}/${props?.seller?.id}`)
          }
        >
          Upload Product
        </Button>
      )}

      <ResizableDialog isShown={isBlockUser} setIsShown={setIsBlockUser}>
        <BlockUser
          setIsBlockUser={setIsBlockUser}
          user={props?.seller}
        />
      </ResizableDialog>

      <ResizableDialog
        isShown={isDeleteUserModal}
        setIsShown={setIsDeleteUserModal}
      >
        <DeleteUser
          setIsDeleteUser={setIsDeleteUserModal}
          userId={props.seller?.id}
          name={props.seller?.name}
        />
      </ResizableDialog>

      <ResizableDialog isShown={openModal} setIsShown={setOpenModal}>
        <ChangeManager
          sellerId={props.seller?.id}
          managers={props.managers}
          setOpenModal={setOpenModal}
        />
      </ResizableDialog>
    </div>
  );
};

export default SellerActionBtns;
