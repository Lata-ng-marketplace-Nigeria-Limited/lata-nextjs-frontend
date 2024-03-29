"use client";

import Image from "next/image";
import React from "react";
import { SelectInput } from "../input/SelectInput";
import FormTopLabel from "../input/FormTopLabel";
import { AppealStatus } from "@/interface/blockedAccounts";
import Button from "../atom/Button";
import ResizableDialog from "../admin/ResizableDialog";
import DeleteUser from "../admin/DeleteUser";

interface Props {
  imageSrc: string;
  idType: AppealStatus;
  userId: string;
  name: string;
}
const AppealedAccounts = (props: Props) => {
  const [isDeleteUserModal, setIsDeleteUserModal] = React.useState(false);

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
    <>
      <section className="mt-12 flex justify-center">
        <div className="w-[36rem] rounded-[0.625rem] border border-grey2 p-6">
          <h1 className="mb-6 text-center text-xl font-semibold xs:text-2xl">
            {props.name}
          </h1>
          <FormTopLabel label="ID type" wrapperClass="mb-8">
            <SelectInput
              options={options}
              placeholder="Select ID type"
              value={props.idType}
              disabled
            />
          </FormTopLabel>
          <div className="flex flex-col items-center justify-center">
            <div className={"mb-6"}>
              <div className="flex justify-center rounded-[0.625rem] border border-grey2 p-2">
                <Image
                  src={props.imageSrc}
                  width={256}
                  height={176}
                  alt="Id type"
                />
              </div>
            </div>
            <div className=" rounded-[0.625rem] border border-grey2 p-6">
              <Button format="secondary" className="mb-6 w-full">
                Unblock User
              </Button>
              <Button
                format="danger"
                className="w-full"
                onClick={() => setIsDeleteUserModal(true)}
              >
                Delete User
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ResizableDialog
        isShown={isDeleteUserModal}
        setIsShown={setIsDeleteUserModal}
      >
        <DeleteUser
          setIsDeleteUser={setIsDeleteUserModal}
          userId={props.userId}
          name={props.name}
        />
      </ResizableDialog>
    </>
  );
};

export default AppealedAccounts;
