import React from "react";
import TableWithRowGaps from "../table/TableWithRowGaps";
import { AppealStatus, BlockedUserDetails } from "@/interface/blockedAccounts";
import { FetchMeta } from "@/interface/general";
import AppAvatar from "../molecule/Avatar";
import { DateTime } from "luxon";
import BadgeWithCount from "../atom/BadgeWithCount";
import HeaderText from "../atom/HeaderText";
import SearchInput from "../admin/SearchInput";
import AppealedAccounts from "./AppealedAccounts";

interface Props {
  blockedAccounts: BlockedUserDetails[];
  meta: FetchMeta;
  numOfUnappealed: number;
  numOfAppealed: number;
  query: string;
}

const BlockedAccountsDisplay = async (props: Props) => {
  return (
    <div>
      <div className="mb-7 flex justify-end gap-4 sl:gap-6">
        <BadgeWithCount
          count={props.numOfUnappealed}
          className="max-xs:text-[10px]"
          text="unapplead"
          isDefaultActive
          variant="primary"
          query="unapplead"
        />

        <BadgeWithCount
          count={props.numOfAppealed}
          className="max-xs:text-[10px]"
          variant="primary"
          text="appealed"
          query="appealed"
        />
      </div>
      <div className="mb-7 flex items-center justify-between">
        <HeaderText title>{"Blocked Accounts"}</HeaderText>
        <SearchInput placeholder={"Search Accounts"} wrapperClass="max-w-max" />
      </div>

      {props.query === "appealed" ? (
        <div className="grid grid-cols-auto-fit gap-6">
          {props?.blockedAccounts?.map((account) => (
            <AppealedAccounts
              imageSrc={account?.avatar}
              idType={account?.file_type as AppealStatus}
              userId={account?.id}
              name={account?.name}
              key={account?.id + "appeal"}
            />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default BlockedAccountsDisplay;
