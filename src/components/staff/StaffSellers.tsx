"use client";

import React, { useEffect, useState } from "react";
import { IAddedUserMeta, User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import TableTopArea from "@components/admin/TableTopArea";
import BadgeWithCount from "../atom/BadgeWithCount";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IBadgeVariants } from "../atom/Badge";

interface Props {
  data: User[];
  meta: FetchMeta;
  countVerifiedBuyers: number;
  countUnverifiedBuyers: number;
}
const StaffSellers = (props: Props) => {
  const [showAddBuyerModal, setShowAddBuyerModal] = useState(false);
  const [filteredData, setFilteredData] = useState<User[]>(props.data);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleAddBuyer = () => {
    setShowAddBuyerModal(!showAddBuyerModal);
  };

  useEffect(() => {
    const filter = props.data.filter(
      (buyer) =>
        // search by name
        buyer?.name.toLowerCase().includes(search) ||
        // search by location
        (buyer?.address &&
          (buyer?.address as string).toLowerCase().includes(search)) ||
        //search by email
        buyer?.email.toLowerCase().includes(search) ||
        // search by reg date
        DateTime.fromISO(buyer?.createdAt)
          .toFormat("dd LLL, yyyy")
          .toLowerCase()
          .includes(search),
    );
    setFilteredData(filter);
  }, [search, props.data]);

  const params = new URLSearchParams(searchParams);

  const activeButtonVariant = (): IBadgeVariants => {
    if (params.get("verified") === "0") {
      return "warning";
    } else {
      return "primary";
    }
  };

  useEffect(() => {
    if (!params.get("verified")) {
      params.set("verified", "1");
    }
  }, []);

  const handleClick = (verified: "0" | "1") => {
    if (verified) {
      params.set("verified", verified);
    } else {
      params.delete("verified", verified);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="mb-7 flex justify-end gap-4 sl:gap-6">
        <BadgeWithCount
          count={props?.countVerifiedBuyers}
          activeVariant={activeButtonVariant()}
          className="max-xs:text-[10px]"
          text="verified"
          variant="primary"
          onClick={() => handleClick("1")}
        />

        <BadgeWithCount
          count={props?.countUnverifiedBuyers}
          activeVariant={activeButtonVariant()}
          className="max-xs:text-[10px]"
          variant="warning"
          text="unverified"
          onClick={() => handleClick("0")}
        />
      </div>
      <TableTopArea
        title="All Buyers"
        buttonText="+ Add Buyer"
        placeholder="Search buyers"
        onClick={handleAddBuyer}
        setSearch={setSearch}
      />
      <TableWithRowGaps
        isClickable
        tableData={filteredData.map((buyer) => {
          return {
            name: buyer?.name,
            email: buyer?.email,
            "reg Date": DateTime.fromISO(buyer?.createdAt).toFormat(
              "dd LLL, yyyy",
            ),
            phone: buyer?.phoneNumber || "-",
          };
        })}
        usePaginate
        meta={props.meta}
      />
    </div>
  );
};

export default StaffSellers;
