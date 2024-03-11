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
import { useUser } from "@/hooks/useUser";
import ResizableDialog from "../admin/ResizableDialog";
import AddSellerForm from "../admin/AddSeller";

interface Props {
  data: User[];
  staff?: User;
  meta: FetchMeta;
}
const StaffSellers = (props: Props) => {
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useUser();

  const handleAddSeller = () => {
    setShowAddSellerModal(!showAddSellerModal);
  };

  return (
    <div>
      <TableTopArea
        title={(user?.role === "STAFF" ? "My" : props.staff?.name) + " Sellers"}
        buttonText="+ Add Seller"
        placeholder="Search buyers"
        onClick={handleAddSeller}
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
      <ResizableDialog
        isShown={showAddSellerModal}
        setIsShown={setShowAddSellerModal}
      >
        <AddSellerForm setShowAddSellerModal={setShowAddSellerModal} />
      </ResizableDialog>
    </div>
  );
};

export default StaffSellers;
