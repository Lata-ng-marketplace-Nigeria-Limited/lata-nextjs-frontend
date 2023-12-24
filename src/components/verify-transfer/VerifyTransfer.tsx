"use client";

import {
  cn,
  downloadPdf,
  formatPrice,
  generateInvoicePdfName,
  getDiscountAmount,
} from "@/utils";
import FormTopLabel from "@components/input/FormTopLabel";
import TextInput from "@components/input/TextInput";
import { FormEvent, useState } from "react";
import { Invoice } from "@/interface/payment";
import { useRouter } from "next/navigation";
import Button from "@atom/Button";
import HeaderText from "@atom/HeaderText";
import { Table } from "@components/table/Table";
import { DateTime } from "luxon";
import { ApiErrorResponse } from "@/interface/general";
import { useToast } from "@components/ui/use-toast";
import { Toggle } from "@molecule/Toggle";
import { findAnInvoiceApi, verifyAnInvoiceApi } from "@/api/invoiceApi";

interface Props {}

export const VerifyTransfer = ({}: Props) => {
  const [invoice, setInvoice] = useState<Invoice>();
  const [paymentId, setPaymentId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [toggleMade, setToggleMade] = useState(false);
  const [lastFetchPaymentId, setLastFetchPaymentId] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useRouter();
  const { toast } = useToast();

  const tableData = !invoice
    ? undefined
    : {
        isVerified: (
          <span
            className={cn("font-bold", {
              "text-success": invoice?.isVerified,
              "text-danger": !invoice?.isVerified,
            })}
          >
            {invoice?.isVerified ? "YES" : "NO"}
          </span>
        ),
        invoiceId: invoice?.id,
        paymentId: invoice?.paymentId,
        userName: invoice?.user?.name,
        userEmail: invoice?.user?.email,
        amountPaid: formatPrice(invoice!.amount),
        vat: formatPrice(invoice!.vat),
        amountWithoutVat: formatPrice(invoice!.amount - invoice!.vat),
        subscriptionName: invoice?.subscription?.name,
        planName: invoice?.plan?.name,
        planDuration:
          invoice?.plan?.duration +
          " " +
          (invoice?.plan?.duration === 1 ? "month" : "months"),
        planCurrentDiscount: invoice?.plan?.discountPercentage + "%",
        planDiscountOnInvoiceCreation: invoice?.discount + "%",
        planAmount: formatPrice(invoice!.plan?.price || 0),
        planAmountToPay: formatPrice(
          getDiscountAmount(
            invoice!.plan?.price || 0,
            invoice!.plan?.discountPercentage || 0,
          ),
        ),
        bankName: invoice?.bankName,
        bankAccountName: invoice?.accountName,
        bankAccountNumber: invoice?.accountNumber,
        ...(invoice?.isVerified && invoice?.verifiedAt
          ? {
              adminNameWhoVerifiedIt: invoice?.admin?.name,
              adminEmailWhoVerifiedIt: invoice?.admin?.email,
              verifiedAt: DateTime.fromISO(invoice!.verifiedAt!).toFormat(
                "dd/MM/yyyy tt",
              ),
              viewTransferReceipt: (
                <>
                  <Button
                    format={"tertiary"}
                    onClick={() => {
                      nav.push(`/transaction/${invoice?.transactionId}`);
                    }}
                  >
                    View
                  </Button>
                </>
              ),
            }
          : {}),
      };

  const handleFind = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToggleMade(false);
    setLoading(true);
    try {
      const { invoice, pdfUrl } = await findAnInvoiceApi(paymentId);
      setInvoice(invoice);
      setPdfUrl(pdfUrl);
      setLastFetchPaymentId(paymentId);
    } catch (error: any) {
      const errorRes: ApiErrorResponse = error;
      const errorArr = errorRes?.data?.error || [];
      errorArr.forEach((err: any) => {
        if (err.field === "params.id") {
          setErrMsg("Invalid payment id");
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfUrl) return;
    if (!invoice) return;
    const fileName = generateInvoicePdfName({
      planName: invoice?.plan?.name,
      planDuration: invoice?.plan?.duration + "",
      reference: invoice?.paymentId,
    });
    downloadPdf({
      url: pdfUrl,
      fileName,
    });
  };

  const handleVerify = async () => {
    if (!invoice) return;
    setLoading(true);
    try {
      const { transaction } = await verifyAnInvoiceApi(invoice!.paymentId);
      toast({
        title: "Success",
        description: "Transfer verified successfully",
        variant: "success",
      });
      nav.push(`/transaction/${transaction.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className={cn(`flex flex-col gap-y-6`)}>
      <form className={cn(``)} onSubmit={handleFind}>
        <FormTopLabel label={"Payment ID"} childrenClass={cn(`flex gap-x-3`)}>
          <TextInput
            wrapperClass={"w-full"}
            placeholder={"Enter payment id"}
            errorMessage={errMsg}
            value={paymentId}
            setValue={setPaymentId}
            onInput={() => {
              setErrMsg("");
            }}
          />

          <Button
            disabled={loading || !paymentId || paymentId === lastFetchPaymentId}
            format={"primary"}
            className={cn(`h-fit`)}
          >
            Find
          </Button>
        </FormTopLabel>
      </form>

      <Toggle
        disabled={loading || !invoice || !!invoice?.transactionId}
        label={"I have verified that this transaction was made successfully"}
        checked={toggleMade}
        setChecked={setToggleMade}
      />

      <div className={"flex gap-x-3"}>
        <Button
          disabled={
            !toggleMade || loading || !invoice || !!invoice?.transactionId
          }
          format={"primary"}
          onClick={handleVerify}
        >
          Verify
        </Button>

        <Button
          disabled={loading || !invoice}
          format={"secondary"}
          onClick={handleDownload}
        >
          Download Invoice
        </Button>
      </div>

      <div>
        <HeaderText>Invoice Details</HeaderText>

        {tableData ? (
          <Table format={"compact"} compactData={tableData} />
        ) : (
          <div className={cn(`text-sm text-gray-500`)}>Nothing to see</div>
        )}
      </div>
    </div>
  );
};
