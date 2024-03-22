import React from "react";
import { DateTime } from "luxon";
import { User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import TableWithRowGaps from "../table/TableWithRowGaps";
import Link from "next/link";
import AppAvatar from "../molecule/Avatar";
import { VIEW_STAFF_ROUTE } from "@/constants/routes";
import AddStaffForm from "./AddStaffForm";

interface Props {
  data: User[];
  meta: FetchMeta;
}
const AllStaff = (props: Props) => {
  return (
    <>
      <AddStaffForm />
      <TableWithRowGaps
        isClickable
        emptyTableTitle="No Staff yet"
        emptyTableDescription="All Staff will appear here"
        tableData={props.data?.map((staff) => {
          return {
            name: (
              <div className="flex items-center gap-2">
                <AppAvatar
                  name={staff?.name}
                  src={staff?.avatar}
                  className="h-[30px] w-[30px] sm:h-[30px] sm:w-[30px]"
                  initialsClass="font-normal text-xs sm:text-xs"
                />
                <Link href={`${VIEW_STAFF_ROUTE}/${staff.id}`}>
                  {staff?.name}
                </Link>
              </div>
            ),
            location: staff?.address,
            "reg Date": DateTime.fromISO(staff?.createdAt).toFormat(
              "dd LLL, yyyy",
            ),
            admin: staff?.managerName || "-",
          };
        })}
        usePaginate
        meta={props.meta}
      />
    </>
  );
};

export default AllStaff;
