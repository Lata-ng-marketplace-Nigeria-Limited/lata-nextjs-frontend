import { PaymentCredentials } from "@/api/payment";
import React, { SetStateAction } from "react";
import { cn, downloadPdf, formatPrice, generateInvoicePdfName } from "@/utils";
import { CancelIcon } from "@atom/icons/Cancel";
import Button from "@atom/Button";
import Hr from "@atom/Hr";
import { CopyButton } from "@molecule/CopyButton";

interface Props {
  paymentResponse: PaymentCredentials | undefined;
  setTransfer: React.Dispatch<SetStateAction<boolean>>;
}

export default function PayWithTransfer(props: Props) {
  const textClass =
    "text-grey10 font-semibold text-[0.9375rem] xs:text-[1.05rem] sm:text-[1.25rem]";

  const handleDownload = () => {
    if (!props.paymentResponse?.pdfUrl) return;
    const fileName = generateInvoicePdfName({
      planName: props.paymentResponse?.planName,
      planDuration: props.paymentResponse?.planDuration,
      reference: props.paymentResponse?.reference,
    });
    downloadPdf({
      url: props.paymentResponse.pdfUrl,
      fileName,
    });
  };

  return (
    <div
      className={cn(
        "grid gap-y-4 xs:gap-y-5 sm:gap-y-6 w-[220px] xms:w-[270px] xs:max-w-full xs:w-[400px] sm:w-[472px]",
      )}
    >
      <div className={"flex justify-between items-center"}>
        <h2 className={cn(textClass)}>Pay via bank transfer</h2>
        <CancelIcon
          className={"w-[20px] xs:w-[24px] sm:w-[28px] cursor-pointer"}
          onClick={() => {
            props.setTransfer(false);
          }}
        />
      </div>

      <Hr className={"border-grey2"} />

      <p className={cn(textClass, "text-[15px] font-medium")}>
        Bank Name: {props.paymentResponse?.bankName}
      </p>
      <p className={cn(textClass, "font-medium")}>
        Acct Name: {props.paymentResponse?.acctName}
      </p>

      <div className={cn(`flex justify-between items-center gap-x-2`)}>
        <p className={cn(textClass, " text-[15px] font-medium")}>
          Acct No: {props.paymentResponse?.acctNumber}
        </p>
        <CopyButton value={props.paymentResponse?.acctNumber || ""} />
      </div>

      <div className={cn(`flex justify-between items-center gap-x-2`)}>
        <p className={cn(textClass, "font-medium")}>
          Payment ID: {props.paymentResponse?.reference}
        </p>
        <CopyButton value={props.paymentResponse?.reference || ""} />
      </div>

      <p className={cn(textClass, "font-medium")}>
        Amount: {formatPrice(props.paymentResponse?.amountToPay || 0)}
      </p>

      <Button
        format={"primary"}
        className={cn(`w-full`)}
        onClick={handleDownload}
      >
        Download Invoice
      </Button>

      <Hr className={"border-grey2"} />

      <h3
        className={cn(
          textClass,
          "text-[0.9375rem] text-[1.05rem] xs:text-[1.25rem] sm:text-[1.5rem] text-grey11 font-medium",
        )}
      >
        *Instruction
      </h3>

      <p className={cn(textClass, "font-medium")}>
        <span className={"font-semibold"}>For mobile transfer</span> use your
        payment ID as the narration
      </p>

      <p className={cn(textClass, "font-medium")}>
        <span className={"font-semibold"}>For bank deposit</span> use your
        payment ID as the depositor’s name
      </p>
    </div>
  );
}
