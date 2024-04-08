"use client";
import MobileBorderArea from "@atom/MobileBorderArea";
import { cn } from "@/utils";
import HeaderText from "@atom/HeaderText";
import HeaderSubText from "@atom/HeaderSubText";
import { TableIcon } from "@atom/icons/TableIcon";
import Button from "@atom/Button";

export const SalesAgreement = () => {
  const handleDownload = () => {
    const fileUrl =
      "https://res.cloudinary.com/dg9by7oca/image/upload/v1712012185/Lata.ng_Sales_Agreement.pdf";
    const fileName = "SALES_AGREEMENT_Request_form.docx";

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_self";
    link.click();

    // Cleanup: remove the dynamically created link
    document.body.removeChild(link);
  };
  return (
    <MobileBorderArea
      showBorderInDesktop
      className={cn(`px-6 sm:px-[60px] py-6 w-fit h-max`)}
      removePadding
    >
      <HeaderText title>Sales Agreement</HeaderText>
      <HeaderSubText>
        Download and read through the LATA.ng sales agreement form
      </HeaderSubText>

      <div
        className={
          "px-[4px] py-3 w-fit h-fit border border-grey4 rounded-[5px] mt-6"
        }
      >
        <TableIcon />
      </div>

      <Button
        format={"primary"}
        className={"block ml-auto mt-[2.5rem]"}
        onClick={handleDownload}
      >
        Download
      </Button>
    </MobileBorderArea>
  );
};
