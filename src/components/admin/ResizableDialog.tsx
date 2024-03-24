import React from "react";
import { Dialog, DialogContent } from "@components/ui/dialog";
import { cn } from "@/utils";

interface Props {
  isShown: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  contentClass?: string;
  children: React.ReactNode;
}
const ResizableDialog = (props: Props) => {
  const handleEscapeClick = () => {
    props.setIsShown(false);
  };

  const handleClickOutside = () => {
    props.setIsShown(false);
  };

  return (
    <Dialog open={props.isShown} modal>
      <DialogContent
        onPointerDownOutside={handleClickOutside}
        onEscapeKeyDown={handleEscapeClick}
        className={cn(
          "max-h-[calc(100vh-100px)] overflow-y-auto px-2 outline-none xls:px-4 xs:px-6",
          props.contentClass,
        )}
      >
        {props.children}
      </DialogContent>
    </Dialog>
  );
};

export default ResizableDialog;
