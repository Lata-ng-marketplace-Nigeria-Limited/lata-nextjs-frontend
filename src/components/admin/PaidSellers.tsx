"use client";

import React from "react";
import BadgeWithCount from "../atom/BadgeWithCount";
import { useRouter, useSearchParams } from "next/navigation";
import { FetchMeta } from "@/interface/general";
import TableWithRowGaps from "../table/TableWithRowGaps";
import { ISubscribedUser, UserRole } from "@/interface/user";
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
  meta: FetchMeta;
  role: UserRole;
}

const formatDate = (date: string) => {
  return DateTime.fromISO(date).toFormat("dd LLL, yyyy");
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

const PaidSellers = (props: Props) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const getBadgeVariant = (): IBadgeVariants => {
    switch (params.get("tab")) {
      case "new":
        return "primary";
      case "active":
        return "success";
      case "returning":
        return "normal";
      case "due":
        return "danger";
      default:
        return "success";
    }
  };

  const sideBtnDisplay = () => {
    const status = params.get("tab");
    return status || "active";
  };

  return (
    <div>
      <div className="mb-7 flex justify-end">
        <div className="flex justify-end gap-4 overflow-x-auto sl:gap-6">
          <BadgeWithCount
            count={props.activeSubscriptionCount}
            query="active"
            isDefaultActive
            className="max-xs:text-[10px]"
            text="active"
            variant="success"
          />

          <BadgeWithCount
            count={props.newSubscriptionCount}
            query="new"
            className="max-xs:text-[10px]"
            variant="primary"
            text="new"
          />

          <BadgeWithCount
            count={props.returningSubscribersCount}
            query="returning"
            className="max-xs:text-[10px]"
            text="returning"
            variant="normal"
          />

          <BadgeWithCount
            count={props.dueSubscriptionCount}
            query="due"
            className="max-xs:text-[10px]"
            text="due"
            variant="danger"
          />
        </div>
      </div>
      <div className="mb-7 flex items-center justify-between">
        <HeaderText title>{"Paid Sellers"}</HeaderText>
        <SearchInput placeholder={"Search Sellers"} wrapperClass="max-w-max" />
      </div>

      <div className="hidden xs:block">
        <PaidSellersBiggerScreenTable
          activeVariant={getBadgeVariant()}
          badgeText={sideBtnDisplay()}
          data={props.data}
          meta={props.meta}
        />
      </div>

      <div className="xs:hidden">
        <PaidSellersSmallerScreenTable
          activeVariant={getBadgeVariant()}
          badgeText={sideBtnDisplay()}
          data={props.data}
          meta={props.meta}
        />
      </div>
    </div>
  );
};

interface ChildProps extends Pick<Props, "data" | "meta"> {
  badgeText: string;
  activeVariant: IBadgeVariants;
}

const PaidSellersBiggerScreenTable = (props: ChildProps) => {
  const router = useRouter();

  return (
    <TableWithRowGaps
      emptyTableTitle="No Paid seller found"
      emptyTableDescription="All paid sellers will be displayed here"
      tableData={props.data?.map((seller) => {
        return {
          name: (
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() =>
                router.push(DASHBOARD_PROTECTED_SELLER_ROUTE + "/" + seller?.id)
              }
            >
              <Badge variant={props.activeVariant} text={props.badgeText} />
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
  );
};

const PaidSellersSmallerScreenTable = (props: ChildProps) => {
  return (
    <TableWithRowGaps
      emptyTableTitle="No Paid seller found"
      emptyTableDescription="All paid sellers will be displayed here"
      hideHeaders
      tableData={props.data?.map((seller) => {
        return {
          left: (
            <div>
              <div className="justify- mb-3 flex gap-2">
                <Badge
                  variant={props.activeVariant}
                  text={props.badgeText}
                  className="max-h-fit"
                />
                <p className="text-sm font-semibold">{seller?.name}</p>
              </div>
              <p className="text-xs">{duration(seller)}</p>
            </div>
          ),
          right: (
            <div>
              <p className="mb-3 font-semibold text-primary">
                {seller?.plan_name}-{seller?.plan_duration}
                {seller?.plan_duration > 1 ? "months" : "month"}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs">{seller?.transaction_provider}</p>
                <p>{formatPrice(seller?.transaction_actual_amount)}</p>
              </div>
            </div>
          ),
        };
      })}
      usePaginate
      meta={props.meta}
    />
  );
};

export default PaidSellers;
