import React from "react";
import Button from "../atom/Button";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => void;
  type: "category" | "subcategory" | "state" | "city";
  name: string;
}
const DeleteModalContent = (props: Props) => {
  return (
    <div>
      <h3 className="mb-6 font-semibold capitalize">Delete {props.type} </h3>
      <p className="mb-6 font-medium text-grey8">
        Are you sure you want to delete the{" "}
        <span className="text-primary"> {props.name} </span>
        {props.type}?
      </p>
      <div className="flex justify-end gap-3">
        <Button
          format="secondary"
          onClick={() => props.setShowModal((prev) => !prev)}
        >
          Cancel
        </Button>
        <Button format="danger" onClick={props.onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteModalContent;
