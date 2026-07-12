"use client";

import { FormEvent, useState } from "react";
import TextInput from "@components/input/TextInput";
import { cn, getTimeFromNow } from "@/utils";
import Button from "@atom/Button";
import { AdminLoan } from "@/api/admin";
import { FetchMeta } from "@/interface/general";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UserTableCard from "@components/table/UserTableCard";
import { Table } from "@components/table/Table";
import EmptyTable from "@components/table/EmptyTable";

interface Props {
  loans: AdminLoan[];
  meta: FetchMeta;
  page: string;
  urlSearch: string;
}

export default function AdminLoansList({ loans, meta, page, urlSearch }: Props) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search === urlSearch) return;
    const params = new URLSearchParams(searchParams);
    params.set("q", search);
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    if (loading) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const tableData = loans.map((loan) => ({
    requester: <UserTableCard user={loan.user} />,
    amount: (
      <p className="text-sm font-semibold text-grey9 whitespace-nowrap">
        ₦{Number(loan.amount).toLocaleString()}
      </p>
    ),
    duration: (
      <p className="text-sm text-grey8 whitespace-nowrap">
        {loan.duration} Months
      </p>
    ),
    income: (
      <div className="flex flex-col">
        <p className="text-sm font-medium text-grey9">₦{Number(loan.monthlyIncome).toLocaleString()}</p>
        <p className="text-xs text-grey6 capitalize">{loan.employmentStatus}</p>
      </div>
    ),
    purpose: (
      <p className="text-sm text-grey7 max-w-[300px] break-words line-clamp-3">
        {loan.purpose}
      </p>
    ),
    dateRequested: (
      <p className="text-xs text-grey6 whitespace-nowrap">
        {getTimeFromNow(loan.createdAt)}
      </p>
    ),
    rowData: loan,
  }));

  return (
    <div>
      <form className={"flex gap-x-3 w-full mb-6"} onSubmit={handleSearch}>
        <TextInput
          inputClass={cn(` h-[2rem] sm:h-10 `)}
          wrapperClass={"w-full"}
          placeholder={"Search loan requests..."}
          value={search}
          setValue={setSearch}
        />
        <Button
          className={"w-full sm:p-1 max-w-[100px]"}
          format={"primary"}
          type={"submit"}
        >
          Search
        </Button>
      </form>

      {loans.length > 0 ? (
        <Table
          tableData={tableData}
          uesPaginate
          meta={meta}
          currentPage={Number(page || "1")}
          onPageChange={handlePageChange}
          loading={loading}
        />
      ) : (
        <EmptyTable
          title="No Loan Requests"
          description="All loan requests submitted by users will appear here."
        />
      )}
    </div>
  );
}
