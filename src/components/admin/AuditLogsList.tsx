"use client";

import { FormEvent, useState } from "react";
import TextInput from "@components/input/TextInput";
import { cn } from "@/utils";
import Button from "@atom/Button";
import { AuditLog } from "@/api/audit";
import { FetchMeta } from "@/interface/general";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Table } from "@components/table/Table";
import EmptyTable from "@components/table/EmptyTable";
import { DateTime } from "luxon";
import BadgeWithCount from "@/components/atom/BadgeWithCount";
import { SelectInput } from "@components/input/SelectInput";
import Link from "next/link";

interface Props {
  auditLogs: AuditLog[];
  meta: FetchMeta;
  stats: {
    total: number;
    admin: number;
    staff: number;
  };
  page: string;
  urlSearch: string;
  urlActivityType: string;
}

export const AuditLogsList = ({ auditLogs, meta, stats, page, urlSearch, urlActivityType }: Props) => {
  const [search, setSearch] = useState(urlSearch);
  const [activityType, setActivityType] = useState(urlActivityType || "ALL");
  const [loading] = useState(false);
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("q", search);
    if (activityType && activityType !== "ALL") {
      params.set("activityType", activityType);
    } else {
      params.delete("activityType");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleActivityChange = (val: string) => {
    setActivityType(val);
    const params = new URLSearchParams(searchParams);
    if (val && val !== "ALL") {
      params.set("activityType", val);
    } else {
      params.delete("activityType");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (pageNumber: number) => {
    if (loading) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getFriendlyAction = (action: string) => {
    const parts = action.split(" ");
    if (parts.length < 2) return action;

    const method = parts[0].toUpperCase();
    const urlPath = parts[1].split("?")[0].replace(/\/v\d+/, "");

    if (urlPath.includes("/products")) {
      if (method === "POST") return "Created Product";
      if (method === "PUT" || method === "PATCH") return "Updated Product";
      if (method === "DELETE") return "Deleted Product";
    }
    if (urlPath.includes("/reels")) {
      if (method === "POST") return "Uploaded Reel";
      if (method === "DELETE") return "Deleted Reel";
    }
    if (urlPath.includes("/loans")) {
      if (method === "POST") return "Submitted Loan Request";
    }
    if (urlPath.includes("/users")) {
      if (method === "PUT" || method === "PATCH") return "Updated User Profile";
      if (method === "POST") return "Registered New User";
    }
    if (urlPath.includes("/categories")) {
      if (method === "POST") return "Created Category";
      if (method === "DELETE") return "Deleted Category";
    }
    if (urlPath.includes("/chats") || urlPath.includes("/chat-messages")) {
      if (method === "POST") return "Sent Message";
    }
    if (urlPath.includes("/payments") || urlPath.includes("/transactions")) {
      if (method === "POST") return "Initiated Payment/Transaction";
    }

    const cleanPath = urlPath.replace(/^\//, "").split("/")[0];
    const noun = cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
    if (method === "POST") return `Created ${noun}`;
    if (method === "PUT" || method === "PATCH") return `Updated ${noun}`;
    if (method === "DELETE") return `Deleted ${noun}`;
    return `${method} ${cleanPath}`;
  };

  const getFriendlyStatus = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return "Success";
    }
    return "Failed";
  };

  const getFriendlyPayload = (payloadString?: string) => {
    if (!payloadString) return "None";
    try {
      const payload = JSON.parse(payloadString);
      if (typeof payload !== "object" || payload === null) return payloadString;

      const items: string[] = [];
      if (payload.name) items.push(`Name: ${payload.name}`);
      if (payload.title) items.push(`Title: ${payload.title}`);
      if (payload.price) items.push(`Price: ₦${payload.price}`);
      if (payload.amount) items.push(`Amount: ₦${payload.amount}`);
      if (payload.email) items.push(`Email: ${payload.email}`);
      if (payload.phone) items.push(`Phone: ${payload.phone}`);
      if (payload.message) items.push(`Msg: "${payload.message}"`);

      if (items.length > 0) {
        return items.join(", ");
      }

      return Object.entries(payload)
        .slice(0, 3)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    } catch {
      return payloadString;
    }
  };

  const getResourceLink = (log: AuditLog) => {
    const parts = log.action.split(" ");
    if (parts.length < 2) return null;

    const method = parts[0].toUpperCase();
    const urlPath = parts[1].split("?")[0].replace(/\/v\d+/, "");

    const pathSegments = urlPath.replace(/^\//, "").split("/");
    let resourceId = pathSegments.find((segment) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
    );

    if (!resourceId && log.payload) {
      try {
        const payloadObj = JSON.parse(log.payload);
        if (payloadObj._resourceId) {
          resourceId = payloadObj._resourceId;
        }
      } catch {}
    }

    const switchQuery = `?sessionSwitched=true&uid=${log.targetUserId}`;

    if (urlPath.includes("/products")) {
      if (method === "DELETE") return null;
      return resourceId ? `/product/${resourceId}${switchQuery}` : `/admin/posts`;
    }

    if (urlPath.includes("/reels")) {
      return `/reels${switchQuery}`;
    }

    if (urlPath.includes("/loans")) {
      return `/request-loan${switchQuery}`;
    }

    if (urlPath.includes("/users")) {
      return resourceId ? `/protected-seller/${resourceId}` : "/sellers";
    }

    if (urlPath.includes("/staff")) {
      return resourceId ? `/staff/${resourceId}` : "/staff";
    }

    return null;
  };

  const tableData = auditLogs.map((log) => {
    const formattedDate = DateTime.fromISO(log.createdAt).toLocaleString(
      DateTime.DATETIME_SHORT,
    );

    const link = getResourceLink(log);
    const friendlyAction = getFriendlyAction(log.action);
    const isProductAction = log.action.includes("/products");

    let actionContent: React.ReactNode = friendlyAction;

    if (link) {
      const label = isProductAction ? "View Product" : friendlyAction;
      actionContent = (
        <Link
          href={link}
          className="text-primary hover:underline font-semibold text-sm"
        >
          {label}
        </Link>
      );
    }

    return {
      admin: `${log.admin?.name || "Unknown"} (${log.admin?.role || "Admin"})`,
      "switched user": `${log.targetUser?.name || "Unknown"} (${log.targetUser?.role || "User"})`,
      action: actionContent,
      details: getFriendlyPayload(log.payload),
      status: getFriendlyStatus(log.statusCode),
      date: formattedDate,
      rowData: log,
    };
  });

  const activityOptions = [
    { label: "All Activities", value: "ALL" },
    { label: "Products", value: "PRODUCT" },
    { label: "Reels", value: "REEL" },
    { label: "Loans", value: "LOAN" },
    { label: "Users & Profiles", value: "USER" },
    { label: "Chats", value: "CHAT" },
    { label: "Payments & Subscriptions", value: "PAYMENT" },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        <BadgeWithCount
          count={stats.total}
          variant="normal"
          text="All Logs"
          query="ALL"
          isDefaultActive
        />
        <BadgeWithCount
          count={stats.admin}
          variant="primary"
          text="Admin Logs"
          query="ADMIN"
        />
        <BadgeWithCount
          count={stats.staff}
          variant="success"
          text="Staff Logs"
          query="STAFF"
        />
      </div>

      <form className={"flex flex-col sm:flex-row gap-3 w-full mb-6"} onSubmit={handleSearch}>
        <TextInput
          inputClass={cn(` h-[2rem] sm:h-10 `)}
          wrapperClass={"w-full sm:flex-1"}
          placeholder={"Search by admin, user, action or IP..."}
          value={search}
          setValue={setSearch}
        />
        <div className="w-full sm:w-[220px]">
          <SelectInput
            value={activityType}
            onValueChange={handleActivityChange}
            options={activityOptions}
            placeholder="Select Activity"
            inputClass="h-10"
          />
        </div>
        <Button
          className={"w-full sm:p-1 max-w-[100px]"}
          format={"primary"}
          type={"submit"}
        >
          Search
        </Button>
      </form>

      {auditLogs.length > 0 ? (
        <Table
          tableData={tableData}
          keyNotCursor={["details"]}
          uesPaginate
          meta={meta}
          currentPage={Number(page || "1")}
          onPageChange={handlePageChange}
          loading={loading}
        />
      ) : (
        <EmptyTable title="No activity logs found" />
      )}
    </div>
  );
};
