"use client";

import React, { useState } from "react";
import { User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import Modal from "@components/molecule/Modal";
import { SellerSignUpForm } from "@components/forms/SellerSignUpForm";
import TableTopArea from "@components/admin/TableTopArea";

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
      <TableTopArea title="All Sellers" buttonText="+ Add Seller" />
      <TableWithRowGaps
        isClickable
        tableData={props?.data?.map((seller) => {
          return {
            name: seller?.name,
            location: seller?.address,
            "reg Date": DateTime.fromISO(seller?.createdAt).toFormat(
              "dd LLL, yyyy",
            ),
            manager: seller.name,
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

export default AllSellers;
