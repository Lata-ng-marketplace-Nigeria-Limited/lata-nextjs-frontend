"use client";

import React, { useEffect, useState } from "react";
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
  const [filteredData, setFilteredData] = useState<User[]>(props.data);
  const [search, setSearch] = useState("");

  const handleAddSeller = () => {
    setShowAddSellerModal(!showAddSellerModal);
  };

  useEffect(() => {
    const filter = props.data.filter(
      (seller) =>
        // search by nam
        seller.name.toLowerCase().includes(search) ||

        // search by manager
        (seller?.meta as IAddedUserMeta)?.manager?.name
          .toLowerCase()
          .includes(search) ||

        // search by location
        (seller.address as string).toLowerCase().includes(search) ||

        // search by reg date
        DateTime.fromISO(seller.createdAt)
          .toFormat("dd LLL, yyyy")
          .toLowerCase()
          .includes(search),
    );
    setFilteredData(filter);
  }, [search, props.data]);

  return (
    <div>
      <TableTopArea
        title="All Sellers"
        buttonText="+ Add Seller"
        placeholder="Search sellers"
        onClick={handleAddSeller}
        setSearch={setSearch}
      />
      <TableWithRowGaps
        isClickable
        tableData={filteredData.map((seller) => {
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
