"use client";

import React from "react";
import Button from "../atom/Button";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { LANDING_ROUTE } from "@/constants/routes";
import { deleteUserApi } from "@/api/admin.client";
import ResizableDialog from "./ResizableDialog";

interface Props {
  userId: string;
  name: string;
}

const DeleteUser = (props: Props) => {
  const { push, refresh } = useRouter();
  const [isDeleteUserModal, setIsDeleteUserModal] = React.useState(false);

  const handleBlockUser = async () => {
    try {
      const response = await deleteUserApi({ id: props.userId });
      if (response.success) {
        toast({
          title: response.message,
          variant: "success",
        });
        setIsDeleteUserModal(false);
        refresh();
        push(LANDING_ROUTE);
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
    <div>
      <Button
        format="danger"
        className="mb-8 block w-full"
        onClick={() => setIsDeleteUserModal(true)}
      >
        Delete Seller
      </Button>

      <ResizableDialog
        isShown={isDeleteUserModal}
        setIsShown={setIsDeleteUserModal}
      >
        <h2 className="mb-2 text-lg font-semibold">Delete Account</h2>
        <div className="mb-3">
          <p className="mb-1 font-bold">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-primary">
              {props.name}&rsquo;s
            </span>{" "}
            Lata account?
          </p>
          <p className="font-semibold text-danger">
            This action is irreversible. All the data associated with this
            account will be permanently deleted.
          </p>
        </div>
        <div className="flex items-center justify-end gap-5">
          <Button
            format="secondary"
            onClick={() => setIsDeleteUserModal(false)}
          >
            Cancel
          </Button>
          <Button
            format="danger"
            className="bg-danger text-white hover:bg-danger hover:text-white"
            onClick={handleBlockUser}
          >
            Delete
          </Button>
        </div>
      </ResizableDialog>
    </div>
  );
};

export default DeleteUser;
