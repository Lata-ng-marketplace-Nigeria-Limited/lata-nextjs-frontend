import React from "react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Button from "../atom/Button";
import { blockUserApi } from "@/api/admin.client";

interface Props {
  userId: string;
  name: string;
  setIsBlockUser: React.Dispatch<React.SetStateAction<boolean>>;
}
const BlockUser = (props: Props) => {
  const { refresh } = useRouter();

  const handleBlockUser = async () => {
    try {
      const response = await blockUserApi({ userId: props.userId });
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">
        Block{" "}
        <span className="text-lg font-semibold text-primary">
          {props.name || "User"}
        </span>
      </h2>
      <p className="mb-4">
        By blocking this user, their account will be temporarily suspended, and
        they won&rsquo;t be able to access the platform. Please click
        &ldquo;Block&rdquo; to proceed with this action.
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
          Block
        </Button>
      </div>
    </div>
  );
};

export default BlockUser;
