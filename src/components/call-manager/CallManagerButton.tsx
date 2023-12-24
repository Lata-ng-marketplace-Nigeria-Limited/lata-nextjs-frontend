"use client";
import { makePhoneCall } from "@/utils";
import Button from "@atom/Button";

export const CallManagerButton = () => {
  return (
    <Button
      format={"secondary"}
      className={"mt-6"}
      onClick={() => makePhoneCall("09069394365")}
    >
      09069394365
    </Button>
  );
};
