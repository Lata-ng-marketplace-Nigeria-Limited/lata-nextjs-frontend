"use client";

import React, { useEffect, useState } from "react";
import BadgeWithCount from "../atom/BadgeWithCount";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FetchMeta } from "@/interface/general";
import TableWithRowGaps from "../table/TableWithRowGaps";
import { ISubscribedUser } from "@/interface/user";
import { DateTime } from "luxon";
import { formatPrice } from "@/utils";
import Badge from "@components/atom/Badge";
import { DASHBOARD_SELLER_PROFILE_ROUTE } from "@/constants/routes";
import HeaderText from "../atom/HeaderText";
import SearchInput from "./SearchInput";

interface Props {
  data: ISubscribedUser[];
  activeSubscriptionCount: number;
  dueSubscriptionCount: number;
  newSubscriptionCount: number;
  unSubscribedUsersCount: number;
  transactionStatus?: string;
  meta: FetchMeta;
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

  const handleClick = (
    transactionStatus: "NEW" | "ACTIVE" | "DUE" | "UNSUBSCRIBED",
  ) => {
    if (transactionStatus) {
      params.set("transactionStatus", transactionStatus);
    } else {
      params.delete("transactionStatus", transactionStatus);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toFormat("dd LLL, yyyy");
  };

  const activeButtonVariant = () => {
    if (params.get("transactionStatus") === "NEW") {
      return "primary";
    } else if (params.get("transactionStatus") === "ACTIVE") {
      return "success";
    } else if (params.get("transactionStatus") === "UNSUBSCRIBED") {
      return "normal";
    } else if (params.get("transactionStatus") === "DUE") {
      return "warning";
    } else {
      return "success";
    }
  };

  const activeSideButton = (
    transactionStatus: "NEW" | "ACTIVE" | "DUE" | "UNSUBSCRIBED",
  ) => {
    if (transactionStatus === "NEW") {
      return "primary";
    } else if (transactionStatus === "ACTIVE") {
      return "success";
    } else if (transactionStatus === "UNSUBSCRIBED") {
      return "normal";
    } else if (transactionStatus === "DUE") {
      return "danger";
    } else {
      return "success";
    }
  };

  return (
    <div>
      <div className="mb-7 flex justify-end">
        <SearchInput
          placeholder={"Search Sellers"}
          wrapperClass="max-w-max"
          setSearch={setSearch}
        />
      </div>
      <div className="mb-7 flex items-center justify-between">
        <HeaderText title>{"Paid Sellers"}</HeaderText>
        <div className="flex justify-end gap-4 sl:gap-6">
          <BadgeWithCount
            count={props.activeSubscriptionCount}
            activeVariant={activeButtonVariant()}
            className="max-xs:text-[10px]"
            text="active"
            variant="success"
            onClick={() => handleClick("ACTIVE")}
          />

          <BadgeWithCount
            count={props.newSubscriptionCount}
            activeVariant={activeButtonVariant()}
            className="max-xs:text-[10px]"
            variant="primary"
            text="new"
            onClick={() => handleClick("NEW")}
          />

          <BadgeWithCount
            count={props.dueSubscriptionCount}
            activeVariant={activeButtonVariant()}
            className="max-xs:text-[10px]"
            text="due"
            variant="danger"
            onClick={() => handleClick("DUE")}
          />

          <BadgeWithCount
            count={props.unSubscribedUsersCount}
            activeVariant={activeButtonVariant()}
            className="max-xs:text-[10px]"
            variant="normal"
            text="unsubscribed"
            onClick={() => handleClick("UNSUBSCRIBED")}
          />
        </div>
      </div>

      <div>
        <TableWithRowGaps
          emptyTableTitle="No Paid seller found"
          emptyTableDescription="All paid sellers will be displayed here"
          tableData={filteredData?.map((seller) => {
            return {
              name: (
                <div
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() =>
                    router.push(
                      DASHBOARD_SELLER_PROFILE_ROUTE + "/" + seller?.id,
                    )
                  }
                >
                  <Badge
                    variant={activeSideButton(seller?.subscription_status)}
                    text={
                      seller?.subscription_status === "ACTIVE"
                        ? "on"
                        : seller?.subscription_status
                    }
                  />
                  <p className="capitalize">{seller?.name}</p>
                </div>
              ),
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
          meta={props.meta}
        />
      </div>
    </div>
  );
};

export default PaidSellers;
