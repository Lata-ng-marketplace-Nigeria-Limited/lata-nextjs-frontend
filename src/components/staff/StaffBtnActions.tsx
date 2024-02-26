"use client";

import React from "react";
import Button from "@components/atom/Button";
import ResizableDialog from "../admin/ResizableDialog";
import BlockUser from "../admin/BlockUser";
import DeleteUser from "../admin/DeleteUser";

interface Props {
  staffId: string;
  staffName: string;
}

const StaffBtnActions = (props: Props) => {
  const [isBlockUser, setIsBlockUser] = React.useState(false);
  const [isDeleteUserModal, setIsDeleteUserModal] = React.useState(false);

  return (
    <React.Fragment>
      <div className="mb-6 rounded-xl border border-grey2 p-6">
        <Button format="primary" className="mb-8 block w-full">
          See Sellers
        </Button>
        <Button format="secondary" className="mb-8 block w-full">
          Block User
        </Button>
        <Button
          format="danger"
          className="mb-8 block w-full"
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
