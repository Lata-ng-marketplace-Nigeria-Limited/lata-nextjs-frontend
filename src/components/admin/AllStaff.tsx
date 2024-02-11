"use client";

import React, { useState } from "react";
import { User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import HeaderText from "../atom/HeaderText";
import Button from "../atom/Button";
import ComboBox from "../input/ComboBox";
import TableWithRowGaps from "../table/TableWithRowGaps";
import Modal from "../molecule/Modal";
import { SellerSignUpForm } from "../forms/SellerSignUpForm";

interface Props {
  data: User[];
  meta: FetchMeta;
}
const AllStaff = (props: Props) => {
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);

  const handleAddStaff = () => {
    setShowAddSellerModal(!showAddSellerModal);
  };

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <HeaderText title>All Staff</HeaderText>
        <div className="flex items-center">
          <ComboBox options={["hi", "hello"]} wrapperClass="max-w-max" />
          <Button format="primary">+ Add Staff</Button>
        </div>
      </div>
      <TableWithRowGaps
        isClickable
        tableData={props?.data?.map((staff) => {
          return {
            name: staff?.name,
            location: staff?.address,
            "reg Date": DateTime.fromISO(staff?.createdAt).toFormat(
              "dd LLL, yyyy",
            ),
            manager: staff.name,
          };
        })}
        usePaginate
        meta={props.meta}
      />

      <Modal isShown={showAddSellerModal} setIsShown={setShowAddSellerModal}>
        <SellerSignUpForm />
      </Modal>
    </div>
  );
};

export default AllStaff;
