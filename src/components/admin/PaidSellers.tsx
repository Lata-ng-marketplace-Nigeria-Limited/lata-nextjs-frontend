"use client";

import React from "react";
import BadgeWithCount from "../atom/BadgeWithCount";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FetchMeta } from "@/interface/general";
import TableWithRowGaps from "../table/TableWithRowGaps";
import { ISubscribedUser } from "@/interface/user";
import { DateTime } from "luxon";
import { formatPrice } from "@/utils";
import Badge, { IBadgeVariants } from "@components/atom/Badge";
import { DASHBOARD_PROTECTED_SELLER_ROUTE } from "@/constants/routes";
import HeaderText from "../atom/HeaderText";
import SearchInput from "./SearchInput";

interface Props {
  data: ISubscribedUser[];
  activeSubscriptionCount: number;
  dueSubscriptionCount: number;
  newSubscriptionCount: number;
  returningSubscribersCount: number;
  transactionStatus?: string;
  meta: FetchMeta;
}

const PaidSellers = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const handleClick = (
    transactionStatus: "NEW" | "ACTIVE" | "DUE" | "RETURNING",
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

  const getBadgeVariant = (): IBadgeVariants => {
    switch (params.get("transactionStatus")) {
      case "NEW":
        return "primary";
      case "ACTIVE":
        return "success";
      case "RETURNING":
        return "normal";
      case "DUE":
        return "danger";
      default:
        return "success";
    }
  };

  const sideBtnDisplay = () => {
    const status = params.get("transactionStatus");
    return status || "active";
  };

  const duration = (seller: ISubscribedUser) => {
    if (seller?.subscription_paid_at && seller?.subscription_expiry_date) {
      return (
        <p>
          {formatDate(seller?.subscription_paid_at)} -{" "}
          {formatDate(seller?.subscription_expiry_date)}
        </p>
      );
    } else if (
      !seller?.subscription_paid_at &&
      seller?.subscription_expiry_date
    ) {
      return <p>{formatDate(seller?.subscription_expiry_date)}</p>;
    } else {
      return "Due";
    }
  };

  return (
    <div>
      <div className="mb-7 flex justify-end">
        <div className="flex justify-end gap-4 overflow-x-auto sl:gap-6">
          <BadgeWithCount
            count={props.activeSubscriptionCount}
            activeVariant={getBadgeVariant()}
            className="max-xs:text-[10px]"
            text="active"
            variant="success"
            onClick={() => handleClick("ACTIVE")}
          />

          <BadgeWithCount
            count={props.newSubscriptionCount}
            activeVariant={getBadgeVariant()}
            className="max-xs:text-[10px]"
            variant="primary"
            text="new"
            onClick={() => handleClick("NEW")}
          />

          <BadgeWithCount
            count={props.returningSubscribersCount}
            activeVariant={getBadgeVariant()}
            className="max-xs:text-[10px]"
            text="returning"
            variant="normal"
            onClick={() => handleClick("RETURNING")}
          />

          <BadgeWithCount
            count={props.dueSubscriptionCount}
            activeVariant={getBadgeVariant()}
            className="max-xs:text-[10px]"
            text="due"
            variant="danger"
            onClick={() => handleClick("DUE")}
          />
        </div>
      </div>
      <div className="mb-7 flex items-center justify-between">
        <HeaderText title>{"Paid Sellers"}</HeaderText>
        <SearchInput placeholder={"Search Sellers"} wrapperClass="max-w-max" />
      </div>

      <div>
        <TableWithRowGaps
          emptyTableTitle="No Paid seller found"
          emptyTableDescription="All paid sellers will be displayed here"
          tableData={props.data?.map((seller) => {
            return {
              name: (
                <div
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() =>
                    router.push(
                      DASHBOARD_PROTECTED_SELLER_ROUTE + "/" + seller?.id,
                    )
                  }
                >
                  <Badge variant={getBadgeVariant()} text={sideBtnDisplay()} />
                  <p className="capitalize">{seller?.name}</p>
                </div>
              ),
              "payment mode": (
                <p className="capitalize">{seller?.transaction_provider}</p>
              ),
              plan:
                seller?.plan_name || seller?.plan_duration ? (
                  <p className="capitalize">
                    {seller?.plan_name}-{seller?.plan_duration}
                    {seller?.plan_duration > 1 ? "months" : "month"}
                  </p>
                ) : (
                  "-"
                ),
              product: seller?.subscription_name || "-",
              duration: duration(seller),
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
