"use client";

import React, { useEffect } from "react";
import {  User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import BadgeWithCount from "../atom/BadgeWithCount";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IBadgeVariants } from "../atom/Badge";
import AddBuyerForm from "./AddBuyerForm";

interface Props {
  data: User[];
  meta: FetchMeta;
  countVerifiedBuyers: number;
  countUnverifiedBuyers: number;
}
const AllBuyers = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

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
      <AddBuyerForm />
      <TableWithRowGaps
        isClickable
        tableData={props.data?.map((buyer) => {
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

export default AllBuyers;
