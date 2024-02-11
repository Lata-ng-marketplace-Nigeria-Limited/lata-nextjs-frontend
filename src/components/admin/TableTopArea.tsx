import React from "react";
import HeaderText from "@components/atom/HeaderText";
import Button from "@components/atom/Button";
import SearchInput from "./SearchInput";

interface Props {
  placeholder?: string;
  title: string;
  buttonText?: string;
  hideButton?: boolean;
}
const TableTopArea = (props: Props) => {
  return (
    <div className="mb-7 flex items-center justify-between">
      <HeaderText title>{props.title || "All Sellers"}</HeaderText>
      <div className="flex items-center gap-2 tablet:gap-10">
        <SearchInput
          placeholder={props.placeholder || "Search sellers"}
          wrapperClass="max-w-max"
        />

        {props.hideButton ? null : (
          <Button format="primary" className="whitespace-nowrap">
            {props.buttonText || "+ Add Seller"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableTopArea;
