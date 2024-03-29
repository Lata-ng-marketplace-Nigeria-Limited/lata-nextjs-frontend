"use client";

import React from "react";
import Button from "@components/atom/Button";
import ResizableDialog from "../admin/ResizableDialog";
import BlockUser from "../blocked-accounts/BlockUser";
import DeleteUser from "../admin/DeleteUser";
import { MANAGED_SELLERS_ROUTE, VIEW_STAFF_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useBlockedUser } from "@/store/states/localStore";

interface Props {
  staffId: string;
  staffName: string;
}

const StaffBtnActions = (props: Props) => {
  const [isBlockUser, setIsBlockUser] = React.useState(false);
  const [isDeleteUserModal, setIsDeleteUserModal] = React.useState(false);
  const { push } = useRouter();
  const { hasBlockedUser } = useBlockedUser();


  return (
    <React.Fragment>
      <div className="mb-6 rounded-xl border border-grey2 p-6 tablet:p-3 sl:p-6 ">
        <Button
          format="primary"
          className="mb-8 block w-full text-base sl:text-lg"
          onClick={() => push(`${VIEW_STAFF_ROUTE}/${props.staffId}/${MANAGED_SELLERS_ROUTE}`)}
        >
          See Sellers
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
          className="mb-8 block w-full text-base sl:text-lg"
          onClick={() => setIsDeleteUserModal(true)}
        >
          Delete Seller
        </Button>
      </div>
      <ResizableDialog isShown={isBlockUser} setIsShown={setIsBlockUser}>
        <BlockUser
          setIsBlockUser={setIsBlockUser}
          userId={props.staffId}
          name={props.staffName}
        />
      </ResizableDialog>

      <ResizableDialog
        isShown={isDeleteUserModal}
        setIsShown={setIsDeleteUserModal}
      >
        <DeleteUser
          setIsDeleteUser={setIsDeleteUserModal}
          userId={props.staffId}
          name={props.staffName}
        />
      </ResizableDialog>
    </React.Fragment>
  );
};

export default StaffBtnActions;
