import { findTransactionApi } from "@/api/payment";
import { cn, formatPrice, getDiscountAmount } from "@/utils";
import startCase from "lodash/startCase";
import { DateTime } from "luxon";
import { Table } from "@components/table/Table";

interface Props {
  id: string;
}

export const Transaction = async ({ id }: Props) => {
  const { transaction } = await findTransactionApi(id);

  const isWalletCredit = transaction.type === "wallet:credit";
  const paidPlanWithWalletCredit = transaction.plan && isWalletCredit;
  const tableData = !transaction
    ? undefined
    : {
        ...(transaction.plan
          ? {
              subscription: "",
              planName: "",
              planAmount: "",
              planDuration: "",
              planDiscount: "",
              planAmountToPay: "",
            }
          : {}),
        amountPaid: "",
        ...(paidPlanWithWalletCredit
          ? {
              walletCreditedWith: "",
            }
          : {}),
        fee: "",
        ...transaction,
        //@ts-ignore
        amountPaid: formatPrice(transaction.amount),
        //@ts-ignore
        fee:
          transaction.amount > transaction.actualAmount
            ? formatPrice(0)
            : formatPrice(transaction.amount - transaction.actualAmount),
        paidVia: startCase(transaction.provider),
        type: startCase(transaction.type),
        isVerified: transaction.isVerified ? "Yes" : "No",
        status: (
          <span
            className={cn("font-bold", {
              "text-success": transaction.status === "SUCCESS",
              "text-danger": transaction.status === "FAIL",
              "text-warning": transaction.status === "PENDING",
            })}
          >
            {transaction.status}
          </span>
        ),
        paidAt: DateTime.fromISO(
          transaction.date || transaction.createdAt,
        ).toLocaleString(DateTime.DATETIME_MED),
        ...(transaction.plan
          ? {
              subscription: transaction.plan.subscription?.name,
              planName: transaction.plan.name,
              planAmount: formatPrice(transaction.plan.price),
              planDuration:
                transaction.plan.duration +
                " " +
                (transaction.plan.duration === 1 ? "month" : "months"),
              planDiscount: transaction.plan.discountPercentage + "%",
              planAmountToPay: formatPrice(
                getDiscountAmount(
                  transaction.plan.price,
                  transaction.plan.discountPercentage,
                ),
              ),
            }
          : {}),
        ...(paidPlanWithWalletCredit
          ? {
              amountPaid: formatPrice(0),
              walletCreditedWith: formatPrice(transaction.amount),
            }
          : {}),
        verifyNarration: (
          <p className={"whitespace-pre"}>
            {transaction.verifyNarration || "N/A"}
          </p>
        ),
      };

  return (
    <>
      {tableData ? (
        <>
          {" "}
          <Table
            format={"compact"}
            compactData={tableData}
            hiddenColumns={[
              "id",
              "userId",
              "planId",
              "actualAmount",
              "provider",
              "providerStatus",
              "sessionId",
              "date",
              "createdAt",
              "updatedAt",
              "amount",
              "meta",
              "plan",
            ]}
          />
        </>
      ) : (
        <div>loading</div>
      )}
    </>
  );
};
