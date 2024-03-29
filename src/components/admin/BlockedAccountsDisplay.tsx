import React from "react";
import TableWithRowGaps from "../table/TableWithRowGaps";
import {  BlockedUserDetails } from "@/interface/blockedAccounts";
import { FetchMeta } from "@/interface/general";
import AppAvatar from "../molecule/Avatar";
import { DateTime } from "luxon";

interface Props {
  blockedAccounts: BlockedUserDetails[];
  meta: FetchMeta;
}
const BlockedAccountsDisplay = async (props: Props) => {
  return (
    <div>
      <TableWithRowGaps
        tableData={props.blockedAccounts?.map((blockedAccount) => {
          return {
            poster: (
              <div className="flex items-center gap-2">
                <AppAvatar
                  name={blockedAccount?.name}
                  src={blockedAccount?.avatar}
                  className="h-[30px] w-[30px] sm:h-[30px] sm:w-[30px]"
                  initialsClass="font-normal text-xs sm:text-xs"
                />
                <p className="font-semibold hover:text-primary">
                  {blockedAccount?.name}
                </p>
              </div>
            ),
            location: blockedAccount?.address,
            email: blockedAccount?.email,
            "Reg Date": DateTime.fromISO(blockedAccount?.createdAt).toFormat(
              "dd LLL, yyyy",
            ),
            manager: blockedAccount?.managerName,
          };
        })}
      />
    </div>
  );
};

export default BlockedAccountsDisplay;
