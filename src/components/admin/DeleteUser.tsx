import React from "react";
import Button from "../atom/Button";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { deleteUserApi } from "@/api/auth.client";
import { LANDING_ROUTE } from "@/constants/routes";

interface Props {
  userId: string;
  name: string;
  setIsDeleteUser: React.Dispatch<React.SetStateAction<boolean>>;
}
const DeleteUser = (props: Props) => {
  const { push, refresh } = useRouter();

  const handleBlockUser = async () => {
    try {
      const response = await deleteUserApi({ id: props.userId });
      if (response.success) {
        toast({
          title: response.message,
          variant: "success",
        });
        props.setIsDeleteUser(false);
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
      {" "}
      <h2 className="mb-2 text-lg font-semibold">
        Delete Account
        {/* <span className="text-lg font-semibold text-primary">
          {props.userId || "User"}
        </span> */}
      </h2>
      <div className="mb-3">
        <p className="mb-1 font-bold">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-primary">{props.name}'s</span>{" "}
          Lata account?
        </p>
        <p className="font-semibold text-danger">
          This action is irreversible. All the data associated with this account
          will be permanently deleted.
        </p>
      </div>
      <div className="flex items-center justify-end gap-5">
        <Button format="secondary" onClick={() => props.setIsDeleteUser(false)}>
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
    </div>
  );
};

export default DeleteUser;
