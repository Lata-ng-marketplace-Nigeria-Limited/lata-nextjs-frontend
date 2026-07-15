"use client";

import React from "react";
import ResizableDialog from "./ResizableDialog";
import { Transaction } from "@/interface/payment";
import { Printer, X, Receipt, ShieldCheck, CreditCard, Activity } from "lucide-react";

interface Props {
  isShown: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  transaction: Transaction | null;
}

const TransactionDetailsModal = ({ isShown, setIsShown, transaction }: Props) => {
  if (!transaction) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${transaction.reference}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #111827; }
              .receipt-container { max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 8px; padding: 24px; }
              .receipt-header { border-bottom: 2px solid #5113A1; padding-bottom: 16px; margin-bottom: 24px; }
              .receipt-title { font-size: 22px; font-weight: bold; color: #5113A1; margin: 0; }
              .receipt-subtitle { font-size: 13px; color: #6B7280; margin-top: 4px; }
              .section-title { font-size: 14px; font-weight: bold; color: #374151; margin-top: 24px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #F3F4F6; padding-bottom: 4px; }
              .receipt-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; line-height: 1.5; }
              .receipt-label { font-weight: 500; color: #4B5563; }
              .receipt-value { color: #111827; text-align: right; word-break: break-all; max-width: 60%; }
              .amount-box { background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 12px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
              .amount-label { font-weight: 600; color: #374151; }
              .amount-value { font-size: 20px; font-weight: 700; color: #5113A1; }
              .receipt-footer { margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 16px; font-size: 12px; text-align: center; color: #9CA3AF; }
              .status-badge { display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: bold; border-radius: 9999px; text-transform: uppercase; }
              .status-success { background-color: #DEF7EC; color: #03543F; }
              .status-pending { background-color: #FEF08A; color: #713F12; }
              .status-failed { background-color: #FDE8E8; color: #9B1C1C; }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <div class="receipt-header">
                <div class="receipt-title">LATA Platform Receipt</div>
                <div class="receipt-subtitle">Reference: ${transaction.reference}</div>
              </div>
              
              <div class="section-title">Payment Overview</div>
              <div class="receipt-row">
                <span class="receipt-label">Status</span>
                <span class="receipt-value">
                  <span class="status-badge ${
                    transaction.status === "SUCCESS"
                      ? "status-success"
                      : transaction.status === "PENDING"
                      ? "status-pending"
                      : "status-failed"
                  }">${transaction.status}</span>
                </span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Payment Provider</span>
                <span class="receipt-value">${transaction.provider || "Wallet"}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Transaction Type</span>
                <span class="receipt-value">${transaction.type}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Date & Time</span>
                <span class="receipt-value">${
                  transaction.createdAt
                    ? new Date(transaction.createdAt).toLocaleString()
                    : "N/A"
                }</span>
              </div>

              <div class="section-title">Payer Information</div>
              <div class="receipt-row">
                <span class="receipt-label">Name</span>
                <span class="receipt-value">${transaction.user?.name || "Unknown User"}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Email Address</span>
                <span class="receipt-value">${transaction.user?.email || "N/A"}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Phone Number</span>
                <span class="receipt-value">${transaction.user?.phoneNumber || "N/A"}</span>
              </div>

              <div class="section-title">Transaction Details</div>
              <div class="receipt-row">
                <span class="receipt-label">Narration</span>
                <span class="receipt-value">${transaction.narration || "N/A"}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Payment ID</span>
                <span class="receipt-value">${transaction.id}</span>
              </div>
              ${
                transaction.verifyNarration
                  ? `<div class="receipt-row">
                      <span class="receipt-label">Verification Logs</span>
                      <span class="receipt-value">${transaction.verifyNarration}</span>
                     </div>`
                  : ""
              }

              <div class="amount-box">
                <span class="amount-label">Total Amount Paid</span>
                <span class="amount-value">₦${Number(transaction.amount).toLocaleString()}</span>
              </div>

              <div class="receipt-footer">
                This is a system generated transaction receipt from LATA.
              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <ResizableDialog isShown={isShown} setIsShown={setIsShown} contentClass="max-w-2xl !p-0">
      <div className="relative flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header banner */}
        <div className="bg-primary px-6 py-8 text-white relative">
          <button
            onClick={() => setIsShown(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            {/* <Receipt className="w-8 h-8 text-white/90" /> */}
            <h2 className="text-xl font-bold">Transaction Details</h2>
          </div>
          {/* <p className="text-white/70 text-xs font-mono select-all">
            ID: {transaction.id}
          </p> */}
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-280px)]">
          {/* Status and core metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-grey2 pb-6">
            <div>
              <p className="text-grey6 text-xs font-medium mb-1">STATUS</p>
              <span
                className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                  transaction.status === "SUCCESS"
                    ? "bg-success/10 text-success"
                    : transaction.status === "PENDING"
                    ? "bg-warning/10 text-warning"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {transaction.status}
              </span>
            </div>
            <div>
              <p className="text-grey6 text-xs font-medium mb-1">PROVIDER</p>
              <p className="text-sm font-semibold text-grey10 uppercase">
                {transaction.provider || "Wallet"}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-grey6 text-xs font-medium mb-1">DATE & TIME</p>
              <p className="text-sm font-semibold text-grey10">
                {transaction.createdAt
                  ? new Date(transaction.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* User detail section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-grey9 uppercase tracking-wider">
                Payer Details
              </h3>
            </div>
            <div className="bg-grey1/50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-grey6 text-xs mb-0.5">Full Name</p>
                <p className="text-sm font-semibold text-grey10">
                  {transaction.user?.name || "Unknown User"}
                </p>
              </div>
              <div>
                <p className="text-grey6 text-xs mb-0.5">Email Address</p>
                <p className="text-sm font-semibold text-grey10 select-all">
                  {transaction.user?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-grey6 text-xs mb-0.5">Phone Number</p>
                <p className="text-sm font-semibold text-grey10">
                  {transaction.user?.phoneNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-grey6 text-xs mb-0.5">Reference Code</p>
                <p className="text-sm font-semibold text-grey10 select-all font-mono">
                  {transaction.reference}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction specifications */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-grey9 uppercase tracking-wider">
                Transaction Specs
              </h3>
            </div>
            <div className="bg-grey1/50 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-grey6">Type</span>
                <span className="font-semibold text-grey10 capitalize">
                  {transaction.type}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-grey6">Narration</span>
                <span className="font-semibold text-grey10 text-right">
                  {transaction.narration || "N/A"}
                </span>
              </div>
              {transaction.verifyNarration && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-grey6">Verification Logs</span>
                  <span className="font-semibold text-grey10 text-right text-xs">
                    {transaction.verifyNarration}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Final values display */}
          <div className="flex items-center justify-between bg-primary/5 rounded-xl border border-primary/10 p-5 mt-2">
            <div>
              <p className="text-primary font-bold text-sm">Amount Paid</p>
              <p className="text-grey5 text-xs">Net received after gateway fees</p>
            </div>
            <p className="text-2xl font-black text-primary">
              ₦{Number(transaction.amount).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-grey1 border-t border-grey2 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setIsShown(false)}
            className="px-4 py-2 border border-grey3 hover:border-grey4 rounded-lg text-sm text-grey8 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-sm transition-colors font-semibold shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
      </div>
    </ResizableDialog>
  );
};

export default TransactionDetailsModal;
