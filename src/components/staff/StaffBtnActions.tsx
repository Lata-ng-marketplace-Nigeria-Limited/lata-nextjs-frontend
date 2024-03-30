import React from "react";
import BlockOrUnblockAccount from "../blocked-accounts/BlockOrUnblockAccount";
import DeleteUser from "../admin/DeleteUser";
import { MANAGED_SELLERS_ROUTE, VIEW_STAFF_ROUTE } from "@/constants/routes";
import { User } from "@/interface/user";
import NavigateButton from "../atom/NavigateButton";

interface Props {
  staff: User;
}

const StaffBtnActions = (props: Props) => {
  return (
    <div className="mb-6 rounded-xl border border-grey2 p-6 tablet:p-3 sl:p-6 ">
      <NavigateButton
        buttonFormat="primary"
        className="mb-8 block w-full text-base sl:text-lg"
        route={`${VIEW_STAFF_ROUTE}/${props.staff?.id}/${MANAGED_SELLERS_ROUTE}`}
      >
        See Sellers
      </NavigateButton>

      <BlockOrUnblockAccount
        userId={props.staff?.id}
        name={props.staff?.name}
        managerId={props.staff?.managerId}
        isBlocked={props.staff?.isBlocked as boolean}
      />

      <DeleteUser userId={props.staff?.id} name={props.staff?.name} />
    </div>
  );
};

export default StaffBtnActions;
