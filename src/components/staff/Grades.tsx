import React from "react";
import { UserDetailContainer } from "./UserDetail";
import { IGrade } from "@/interface/grade";
import { cn, formatNumber } from "@/utils";
import UnCheckedBoxPurple from "../atom/icons/UnCheckedBoxPurple";
import CheckedboxPurple from "../atom/icons/CheckedboxPurple";

interface Props {
  grades: IGrade[];
  sales: number;
  gradePay: IGrade;
  wrapperClass?: string;
}

const Grades = (props: Props) => {
  return (
    <UserDetailContainer
      wrapperClass={cn(props.wrapperClass)}
      heading="Grades"
      headingClass={cn("text-base sl:text-xl")}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 lg:grid-cols-5 lg:gap-1">
        {props?.grades?.map((grade, index) => (
          <div className="flex items-center gap-2 mb-10 sm:mb-0 sl:gap-3" key={index}>
            {props.gradePay?.id === grade.id ? (
              <CheckedboxPurple className="h-[16px] w-[16px]" />
            ) : (
              <UnCheckedBoxPurple className="h-[16px] w-[16px]" />
            )}
            <p className="text-sm font-normal sl:text-lg">
              Grade {grade?.level},{" "}
              {String(grade.amount).includes("399")
                ? "399k"
                : formatNumber(grade?.amount, true)}
            </p>
          </div>
        ))}
      </div>
    </UserDetailContainer>
  );
};

export default Grades;
