"use client";

import React, { useState } from "react";
import { DateTime } from "luxon";
import { User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import TableWithRowGaps from "../table/TableWithRowGaps";
import TableTopArea from "./TableTopArea";
import AddStaffForm from "./AddStaffForm";
import ResizableDialog from "./ResizableDialog";

interface Props {
  data: User[];
  meta: FetchMeta;
}
const AllStaff = (props: Props) => {
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  const handleAddStaff = () => {
    setShowAddStaffModal(!showAddStaffModal);
  };

  return (
    <div>
      <TableTopArea
        title="All Staff"
        buttonText="+ Add Staff"
        placeholder="Search staff"
        onClick={handleAddStaff}
      />
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
            admin: staff.name,
          };
        })}
        usePaginate
        meta={props.meta}
      />

      <ResizableDialog
        isShown={showAddStaffModal}
        setIsShown={setShowAddStaffModal}
      >
        <AddStaffForm setShowAddSellerModal={setShowAddStaffModal} />
      </ResizableDialog>
    </div>
  );
};

export default AllStaff;
