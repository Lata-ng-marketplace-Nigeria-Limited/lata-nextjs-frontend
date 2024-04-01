import React from "react";
import { User } from "@/interface/user";
import { FetchMeta } from "@/interface/general";
import { DateTime } from "luxon";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import AddSellerForm from "@components/admin/AddSeller";
import BadgeWithCount from "../atom/BadgeWithCount";
import Link from "next/link";
import { DASHBOARD_PROTECTED_SELLER_ROUTE } from "@/constants/routes";
import AppAvatar from "../molecule/Avatar";

interface Props {
  data: User[];
  meta: FetchMeta;
  countVerifiedSellers?: number;
  countUnverifiedSellers?: number;
  usersWithNoUploadsCount?: number;
}

const AllSellers = (props: Props) => {
  return (
    <div>
      <div className="mb-7 flex justify-end gap-4 sl:gap-6">
        <BadgeWithCount
          count={props?.countVerifiedSellers || 0}
          className="max-xs:text-[10px]"
          text="verified"
          isDefaultActive
          variant="primary"
          query="verified"
        />

        <BadgeWithCount
          count={props?.countUnverifiedSellers || 0}
          className="max-xs:text-[10px]"
          variant="warning"
          text="unverified"
          query="unverified"
        />

        <BadgeWithCount
          count={props?.usersWithNoUploadsCount || 0}
          className="max-xs:text-[10px]"
          variant="normal"
          text="No Uploads"
          query="no_uploads"
        />
      </div>
      <AddSellerForm />

      <div className="max-xs:hidden">
        <BiggerScreenTable data={props.data} meta={props.meta} />
      </div>

      <div className="xs:hidden">
        <SmallerScreenTable data={props.data} meta={props.meta} />
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
          manager: seller?.managerName || "N/A",
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
              <p className="mb-3 text-sm font-semibold">
                {seller?.managerName || "N/A"}
              </p>
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

export default AllSellers;
