"use client";

import React from "react";
import ChangeManager from "./ChangeManager";
import {
  ADMIN_UPLOAD_PRODUCT_ROUTE,
  ADMIN_VERIFY_TRANSFERS_ROUTE,
} from "@/constants/routes";
import { User } from "@/interface/user";
import BlockOrUnblockAccount from "../blocked-accounts/BlockOrUnblockAccount";
import DeleteUser from "./DeleteUser";
import { useUser } from "@/hooks/useUser";
import { IGetProtectedSellerApi } from "@/api/admin";
import NavigateButton from "../atom/NavigateButton";

interface Props {
  managers: User[];
  seller: IGetProtectedSellerApi["data"];
}

const SellerActionBtns = (props: Props) => {
  const { user } = useUser();

  return (
    <div className="mb-6 rounded-xl border border-grey2 p-6">
      {user?.role === "ADMIN" ? (
        <>
          <ChangeManager
            sellerId={props.seller?.id}
            managers={props.managers}
          />
          <NavigateButton
            buttonFormat="secondary"
            className="mb-8 block w-full"
            route={ADMIN_VERIFY_TRANSFERS_ROUTE}
          >
            Activate Subscription
          </NavigateButton>

          <NavigateButton
            buttonFormat="secondary"
            className="mb-8 block w-full"
            route={`${ADMIN_UPLOAD_PRODUCT_ROUTE}/${props?.seller?.id}`}
          >
            Upload Product
          </NavigateButton>
          <BlockOrUnblockAccount
            userId={props.seller?.id}
            name={props.seller?.name}
            managerId={props.seller?.managerId}
            isBlocked={props.seller?.isBlocked as boolean}
          />
          <DeleteUser userId={props.seller?.id} name={props.seller?.name} />
        </>
      ) : (
        <NavigateButton
          buttonFormat="secondary"
          className="mb-8 block w-full"
          route={`${ADMIN_UPLOAD_PRODUCT_ROUTE}/${props?.seller?.id}`}
        >
          Upload Product
        </NavigateButton>
      )}
    </div>
  );
};

export default SellerActionBtns;
