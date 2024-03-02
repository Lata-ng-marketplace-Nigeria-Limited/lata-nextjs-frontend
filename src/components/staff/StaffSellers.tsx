"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import TableTopArea from "@components/admin/TableTopArea";
import AppAvatar from "../molecule/Avatar";
import Link from "next/link";
import { DASHBOARD_PROTECTED_SELLER_ROUTE } from "@/constants/routes";

interface Props {
  data: User[];
  staff?: User;
  meta: FetchMeta;
}
const StaffSellers = (props: Props) => {
  const [showAddBuyerModal, setShowAddBuyerModal] = useState(false);
  const [filteredData, setFilteredData] = useState<User[]>(props.data);
  const [search, setSearch] = useState("");

  const handleAddBuyer = () => {
    setShowAddBuyerModal(!showAddBuyerModal);
  };

  // useEffect(() => {
  //   const filter = props.data.filter(
  //     (buyer) =>
  //       // search by name
  //       buyer?.name.toLowerCase().includes(search) ||
  //       // search by location
  //       (buyer?.address &&
  //         (buyer?.address as string).toLowerCase().includes(search)) ||
  //       //search by email
  //       buyer?.email.toLowerCase().includes(search) ||
  //       // search by reg date
  //       DateTime.fromISO(buyer?.createdAt)
  //         .toFormat("dd LLL, yyyy")
  //         .toLowerCase()
  //         .includes(search),
  //   );
  //   setFilteredData(filter);
  // }, [search, props.data]);

  return (
    <div>
      <TableTopArea
        title={props.staff?.name + " Sellers"}
        buttonText="+ Add Buyer"
        placeholder="Search buyers"
        onClick={handleAddBuyer}
        setSearch={setSearch}
      />
      <TableWithRowGaps
        isClickable
        tableData={props?.data?.map((seller) => {
          return {
            name: (
              <div className="flex items-center gap-2">
                <AppAvatar
                  name={seller?.name}
                  src={seller?.avatar}
                  className="h-[30px] w-[30px] sm:h-[30px] sm:w-[30px]"
                  initialsClass="font-normal text-xs sm:text-xs"
                />
                <Link
                  href={DASHBOARD_PROTECTED_SELLER_ROUTE + "/" + seller?.id}
                  className="hover:text-primary"
                >
                  {seller?.name}
                </Link>
              </div>
            ),
            location: seller?.address,
            "reg Date": DateTime.fromISO(seller?.createdAt).toFormat(
              "dd LLL, yyyy",
            ),
            manager: props.staff?.name || "-",
          };
        })}
        usePaginate
        meta={props.meta}
      />
    </div>
  );
};

export default StaffSellers;
