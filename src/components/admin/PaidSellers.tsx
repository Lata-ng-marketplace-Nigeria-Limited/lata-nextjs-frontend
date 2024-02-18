"use client";

import React, { useEffect, useState } from "react";
import BadgeWithCount from "../atom/BadgeWithCount";
import { IProductStatusType } from "../shop/ProductStatus";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FetchMeta } from "@/interface/general";
import TableTopArea from "./TableTopArea";
import TableWithRowGaps from "../table/TableWithRowGaps";
import { ISubscribedUser } from "@/interface/user";
import { DateTime } from "luxon";
import { formatPrice } from "@/utils";

interface Props {
  data: ISubscribedUser[];
  activeSubscriptionCount: number;
  dueSubscriptionCount: number;
  newSubscriptionCount: number;
  // meta: FetchMeta;
}

const PaidSellers = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [filteredData, setFilteredData] = useState<ISubscribedUser[]>(
    props.data,
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!props.data) return;
    const filter = props.data.filter(
      (seller) =>
        // search by name
        seller?.name?.toLowerCase().includes(search) ||
        // search by payment mode
        seller?.transaction_provider?.toLowerCase().includes(search) ||
        // search by plan
        seller?.plan_name?.toLowerCase().includes(search) ||
        // search by product
        seller?.subscription_name?.toLowerCase().includes(search) ||
        // search by amount
        seller?.transaction_actual_amount?.toString().includes(search),
    );
    setFilteredData(filter);
  }, [search, props.data]);

  const params = new URLSearchParams(searchParams);
  const handleClick = (status: IProductStatusType) => {
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status", status);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toFormat("dd LLL, yyyy");
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 sl:gap-6">
        <BadgeWithCount
          count={props.newSubscriptionCount}
          // activeVariant={activeButtonVariant()}
          className="max-xs:text-[10px]"
          variant="primary"
          text="new"
          // onClick={() => handleClick("active")}
        />
        <BadgeWithCount
          count={props.activeSubscriptionCount}
          // activeVariant={activeButtonVariant()}
          className="max-xs:text-[10px]"
          text="active"
          variant="success"
          onClick={() => handleClick("reviewing")}
        />
        <BadgeWithCount
          count={props.dueSubscriptionCount}
          // activeVariant={activeButtonVariant()}
          className="max-xs:text-[10px]"
          text="due"
          variant="warning"
          onClick={() => handleClick("denied")}
        />
      </div>
      <div>
        <TableTopArea
          title="All Sellers"
          buttonText="+ Add Seller"
          placeholder="Search sellers"
          setSearch={setSearch}
          hideButton
        />
        <TableWithRowGaps
          isClickable
          tableData={filteredData?.map((seller) => {
            return {
              name: seller?.name,
              "payment mode": (
                <p className="capitalize">{seller?.transaction_provider}</p>
              ),
              plan: (
                <p className="capitalize">
                  {seller?.plan_name}-{seller?.plan_duration}
                  {seller?.plan_duration > 1 ? "months" : "month"}
                </p>
              ),
              product: seller?.subscription_name,
              duration: (
                <p>
                  {formatDate(seller?.subscription_paid_at)} -{" "}
                  {formatDate(seller?.subscription_expiry_date)}
                </p>
              ),
              amount: <p>{formatPrice(seller?.transaction_actual_amount)}</p>,
            };
          })}
          usePaginate
          // meta={props.meta}
        />
      </div>
    </div>
  );
};

export default PaidSellers;
