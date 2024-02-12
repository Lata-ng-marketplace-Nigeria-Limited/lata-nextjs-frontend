"use client";

import React, { useState } from "react";
import { DateTime } from "luxon";
import { User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import TableWithRowGaps from "../table/TableWithRowGaps";
import Modal from "@components/molecule/Modal";
import { SellerSignUpForm } from "@components/forms/SellerSignUpForm";
import TableTopArea from "./TableTopArea";

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
     <TableTopArea title="All Staff" buttonText="+ Add Staff" placeholder="Search staff"/>
      <TableWithRowGaps
        isClickable
        emptyTableTitle="No Staff yet"
        emptyTableDescription="All Staff will appear here"
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
