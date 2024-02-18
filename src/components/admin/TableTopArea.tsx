import React from "react";
import HeaderText from "@components/atom/HeaderText";
import Button from "@components/atom/Button";
import SearchInput from "./SearchInput";

interface Props {
  placeholder?: string;
  title: string;
  buttonText?: string;
  hideButton?: boolean;
  onClick?: () => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const TableTopArea = (props: Props) => {
  return (
    <div className="mb-7 flex items-center justify-between">
      <HeaderText title>{props.title}</HeaderText>
      <div className="flex items-center gap-2 tablet:gap-10">
        <SearchInput
          placeholder={props.placeholder}
          wrapperClass="max-w-max"
          setSearch={props.setSearch}
        />

        {props.hideButton ? null : (
          <Button
            format="primary"
            className="whitespace-nowrap"
            onClick={props.onClick}
          >
            {props.buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableTopArea;
