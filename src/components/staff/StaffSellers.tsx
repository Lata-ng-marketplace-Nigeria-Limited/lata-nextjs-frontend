import React from "react";
import { User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import AppAvatar from "../molecule/Avatar";
import Link from "next/link";
import { DASHBOARD_PROTECTED_SELLER_ROUTE } from "@/constants/routes";
import AddSellerForm from "../admin/AddSeller";
import { cn } from "@/utils";

interface Props {
  data: User[];
  staff?: User;
  meta: FetchMeta;
}

const StaffSellers = (props: Props) => {
  return (
    <div>
      <AddSellerForm />

      <div className="max-xs:hidden">
        <BiggerScreenTable
          data={props.data}
          meta={props.meta}
          staff={props.staff}
        />
      </div>

      <div className="xs:hidden">
        <SmallerScreenTable
          data={props.data}
          meta={props.meta}
          staff={props.staff}
        />
      </div>
    </div>
  );
};

const BiggerScreenTable = (props: Props) => {
  return (
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
  );
};

const SmallerScreenTable = (props: Props) => {
  return (
    <TableWithRowGaps
      isClickable
      hideHeaders
      tableData={props?.data?.map((seller) => {
        return {
          left: (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <AppAvatar
                  name={seller?.name}
                  src={seller?.avatar}
                  className="h-[30px] w-[30px] sm:h-[30px] sm:w-[30px]"
                  initialsClass="font-normal text-xs sm:text-xs"
                />
                <Link
                  href={DASHBOARD_PROTECTED_SELLER_ROUTE + "/" + seller?.id}
                  className="text-sm font-semibold hover:text-primary"
                >
                  {seller?.name}
                </Link>
              </div>
              <p>{seller?.address}</p>
            </div>
          ),
          right: (
            <div>
              <p className="mb-3 text-sm font-semibold">{props.staff?.name}</p>
              <p className="text-xs">
                {DateTime.fromISO(seller?.createdAt).toFormat("dd LLL, yyyy")}
              </p>
            </div>
          ),
        };
      })}
      usePaginate
      meta={props.meta}
    />
  );
};

export default StaffSellers;
