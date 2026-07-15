"use client";

import React, { useState } from "react";
import { Transaction, TransactionType } from "@/interface/payment";
import { FetchMeta } from "@/interface/general";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import AppAvatar from "../molecule/Avatar";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Download, CreditCard, RefreshCw } from "lucide-react";
import TransactionDetailsModal from "./TransactionDetailsModal";
import { DateTime } from "luxon";
import SearchInput from "./SearchInput";

interface Props {
  initialData: Transaction[];
  meta: FetchMeta;
  currentPage: number;
  currentType: string;
}

const AdminRevenueList = ({ initialData, meta, currentPage, currentType }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleRowClick = (row: any) => {
    if (row && row.rowData) {
      setSelectedTransaction(row.rowData);
      setIsModalOpen(true);
    }
  };
  const handleExportCSV = () => {
    const headers = [
      "Transaction ID",
      "Payer Name",
      "Payer Email",
      "Payer Phone",
      "Amount Paid",
      "Gateway Fee",
      "Net Amount",
      "Currency",
      "Type",
      "Status",
      "Reference",
      "Provider",
      "Description",
      "Date"
    ];

    const rows = initialData.map((tx) => {
      const payerName = tx.user?.name || "Unknown";
      const actualAmount = tx.actualAmount || tx.amount;
      const fee = Number(tx.amount) - Number(actualAmount);
      return [
        tx.id,
        payerName,
        tx.user?.email || "N/A",
        tx.user?.phoneNumber || "N/A",
        tx.amount,
        fee.toFixed(2),
        actualAmount,
        tx.currency || "NGN",
        tx.type,
        tx.status,
        tx.reference,
        tx.provider || "Wallet",
        tx.narration || "",
        tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "N/A"
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lata_transactions_report_${DateTime.now().toFormat("yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Convert raw transactions to table display rows
  const tableRows = initialData.map((tx) => {
    const payerName = tx.user?.name || "Unknown";
    
    return {
      user: (
        <div className="flex items-center gap-2">
          <AppAvatar
            name={payerName}
            src={tx.user?.avatar}
            className="h-[32px] w-[32px]"
            initialsClass="font-semibold text-xs text-primary"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-grey10 text-sm">{payerName}</span>
            <span className="text-xs text-grey6">{tx.user?.email}</span>
          </div>
        </div>
      ),
      type: (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-grey1 text-grey9 capitalize">
          <CreditCard className="w-3.5 h-3.5 text-grey6" />
          {tx.type.replace("wallet:", "wallet ")}
        </span>
      ),
      amount: (
        <span className="font-bold text-grey10 text-sm">
          ₦{Number(tx.amount).toLocaleString()}
        </span>
      ),
      reference: (
        <span className="font-mono text-xs text-grey8 select-all">{tx.reference}</span>
      ),
      provider: (
        <span className="text-xs font-medium text-grey6 uppercase">{tx.provider || "Wallet"}</span>
      ),
      status: (
        <span
          className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full ${
            tx.status === "SUCCESS"
              ? "bg-success/10 text-success"
              : tx.status === "PENDING"
              ? "bg-warning/10 text-warning"
              : "bg-danger/10 text-danger"
          }`}
        >
          {tx.status}
        </span>
      ),
      date: (
        <span className="text-xs text-grey6">
          {tx.createdAt ? DateTime.fromISO(tx.createdAt).toFormat("dd LLL, yyyy HH:mm") : "N/A"}
        </span>
      ),
      rowData: tx
    };
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Search Input Box */}
      <div className="max-w-md w-full">
        <SearchInput placeholder="Search by name, email, reference..." />
      </div>

      {/* Filters and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between border-b border-grey2 pb-4">
        {/* Type Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All Transactions", value: "" },
            { label: "Subscriptions", value: "subscription" },
            { label: "Wallet Credits", value: "wallet:credit" },
            { label: "Wallet Debits", value: "wallet:debit" }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTypeChange(tab.value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentType === tab.value
                  ? "bg-primary text-white shadow-sm"
                  : "bg-grey1 hover:bg-grey2 text-grey8"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleTypeChange(currentType)}
            className="flex items-center justify-center p-2 rounded-lg border border-grey2 hover:bg-grey1 text-grey6 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            disabled={initialData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-grey3 hover:border-grey4 hover:bg-grey1/50 text-grey8 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <Download className="w-4 h-4 text-grey6" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-grey2 overflow-hidden">
        <TableWithRowGaps
          isClickable
          tableData={tableRows}
          onRowClick={handleRowClick}
          usePaginate
          meta={meta}
          emptyTableTitle="No Transactions Found"
          emptyTableDescription="There are no transaction records match the current criteria."
        />
      </div>

      {/* Details View Drawer/Modal */}
      <TransactionDetailsModal
        isShown={isModalOpen}
        setIsShown={setIsModalOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default AdminRevenueList;
