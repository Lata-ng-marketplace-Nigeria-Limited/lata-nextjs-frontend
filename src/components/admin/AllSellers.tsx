"use client";

import React, { useState } from "react";
import { IAddedUserMeta, User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import TableTopArea from "@components/admin/TableTopArea";
import AddSellerForm from "@components/admin/AddSeller";
import ResizableDialog from "./ResizableDialog";

interface Props {
  data: User[];
  meta: FetchMeta;
}
const AllSellers = (props: Props) => {
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);

  const handleAddSeller = () => {
    setShowAddSellerModal(!showAddSellerModal);
  };

  return (
    <div>
      <TableTopArea
        title="All Sellers"
        buttonText="+ Add Seller"
        placeholder="Search sellers"
        onClick={handleAddSeller}
      />
      <TableWithRowGaps
        isClickable
        tableData={props?.data?.map((seller) => {
          return {
            name: seller?.name,
            location: seller?.address,
            "reg Date": DateTime.fromISO(seller?.createdAt).toFormat(
              "dd LLL, yyyy",
            ),
            manager: (seller?.meta as IAddedUserMeta)?.manager?.name || "-",
          };
        })}
        usePaginate
        meta={props.meta}
      />

      <ResizableDialog
        isShown={showAddSellerModal}
        setIsShown={setShowAddSellerModal}
      >
        <AddSellerForm setShowAddSellerModal={setShowAddSellerModal} />
      </ResizableDialog>
    </div>
  );
};

export default AllSellers;
