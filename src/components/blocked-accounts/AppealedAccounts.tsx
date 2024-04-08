import Image from "next/image";
import React from "react";
import { SelectInput } from "../input/SelectInput";
import FormTopLabel from "../input/FormTopLabel";
import { BlockedUserDetails } from "@/interface/blockedAccounts";
import DeleteUser from "../admin/DeleteUser";
import BlockOrUnblockAccount from "./BlockOrUnblockAccount";

interface Props {
  userDetail: BlockedUserDetails;
}
const AppealedAccounts = (props: Props) => {
  const options = [
    { label: "NIN", value: "NIN" },
    { label: "Driver's License", value: "DRIVERS_LICENSE" },
    {
      label: "International Passport",
      value: "INTERNATIONAL_PASSPORT",
    },
    { label: "Voter's Card", value: "VOTERS_CARD" },
    { label: "Others", value: "OTHER" },
  ];

  return (
    <section className="mt-12 flex justify-center">
      <div className="w-full rounded-[0.625rem] border border-grey2 p-6 sm:max-w-[29.75rem]">
        <h1 className="mb-6 text-center text-xl font-semibold xs:text-2xl">
          {props.userDetail?.name}
        </h1>
        <FormTopLabel label="ID type" wrapperClass="mb-8">
          <SelectInput
            options={options}
            placeholder="Select ID type"
            value={props.userDetail?.file_type}
            disabled
          />
        </FormTopLabel>
        <div className="flex flex-col items-center justify-center">
          <div className={"mb-6"}>
            <div className="flex justify-center rounded-[0.625rem] border border-grey2 p-2">
              <Image
                src={props.userDetail?.file}
                width={200}
                height={156}
                alt="Id type"
              />
            </div>
          </div>
          <div className=" rounded-[0.625rem] border border-grey2 p-6">
            <BlockOrUnblockAccount
              userId={props.userDetail?.user_id}
              managerId={props.userDetail?.managerId}
              name={props.userDetail?.name}
              isBlocked={props.userDetail?.isBlocked}
            />
            <DeleteUser
              userId={props.userDetail?.id}
              name={props.userDetail?.name}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppealedAccounts;
