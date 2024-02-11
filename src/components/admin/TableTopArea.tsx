import React from "react";
import HeaderText from "@components/atom/HeaderText";
import Button from "@components/atom/Button";
import ComboBox from "@components/input/ComboBox";
import SearchInput from "./SearchInput";

interface Props {
    placeholder?: string
}
const TableTopArea = (props: Props) => {
  return (
    <div className="mb-7 flex items-center justify-between">
      <HeaderText title>All Sellers</HeaderText>
      <div className="flex items-center">
        <SearchInput wrapperClass="" placeholder="Search sellers"/>
        <Button format="primary">+ Add Seller</Button>
      </div>
    </div>
  );
};

export default TableTopArea;
