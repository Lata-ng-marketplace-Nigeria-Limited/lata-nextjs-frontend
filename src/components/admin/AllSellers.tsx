"use client";

import React, { useState } from "react";
import { IAddedUserMeta, User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import TableTopArea from "@components/admin/TableTopArea";
import AddSellerForm from "@components/admin/AddSeller";
import { Dialog, DialogContent } from "@components/ui/dialog";

interface Props {
  data: User[];
  meta: FetchMeta;
}
const AllSellers = (props: Props) => {
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);

  const handleAddSeller = () => {
    setShowAddSellerModal(!showAddSellerModal);
  };

  const handleEscapeClick = () => {
    setShowAddSellerModal(false);
  };

  const handleClickOutside = () => {
    setShowAddSellerModal(false);
  };

  return (
    <div>
      <TableTopArea
        title="All Sellers"
        buttonText="+ Add Seller"
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

      <Dialog open={showAddSellerModal} modal>
        <DialogContent
          onPointerDownOutside={handleClickOutside}
          onEscapeKeyDown={handleEscapeClick}
          className="max-h-[calc(100vh-100px)] overflow-y-auto px-2 xls:px-4 xs:px-6"
        >
          <AddSellerForm setShowAddSellerModal={setShowAddSellerModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllSellers;
