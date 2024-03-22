import React from "react";
import { User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import BadgeWithCount from "../atom/BadgeWithCount";
import AddBuyerForm from "./AddBuyerForm";

interface Props {
  data: User[];
  meta: FetchMeta;
  countVerifiedBuyers: number;
  countUnverifiedBuyers: number;
}
const AllBuyers = (props: Props) => {
  return (
    <div>
      <div className="mb-7 flex justify-end gap-4 sl:gap-6">
        <BadgeWithCount
          count={props?.countVerifiedBuyers}
          className="max-xs:text-[10px]"
          text="verified"
          isDefaultActive
          variant="primary"
          query="verified"
        />

        <BadgeWithCount
          count={props?.countUnverifiedBuyers}
          className="max-xs:text-[10px]"
          variant="warning"
          text="unverified"
          query="unverified"
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
