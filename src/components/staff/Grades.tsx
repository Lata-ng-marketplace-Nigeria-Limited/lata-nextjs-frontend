"use client";

import React from "react";
import { UserDetailContainer } from "./UserDetail";
import { IGrade } from "@/interface/grade";
import { formatPriceCompact } from "@/utils";
import UnCheckedBoxPurple from "../atom/icons/UnCheckedBoxPurple";
import CheckedboxPurple from "../atom/icons/CheckedboxPurple";

interface Props {
  grades: IGrade[];
  sales: number;
}
const Grades = (props: Props) => {
  const [activeGrade, setActiveGrade] = React.useState<IGrade | null>(null);

  function findCategory() {
    for (const category of props.grades) {
      if (props.sales >= category.amount) {
        setActiveGrade(category);
        return category;
      }
    }
    return null;
  }

  React.useEffect(() => {
    findCategory();
  }, [props.sales]);

  return (
    <UserDetailContainer heading="Grades">
      <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-4 lg:grid-cols-5 lg:gap-1">
        {props?.grades?.map((grade, index) => (
          <div className="flex items-center gap-3" key={index}>
            {activeGrade?.id === grade.id ? (
              <CheckedboxPurple className="h-[16px] w-[16px]" />
            ) : (
              <UnCheckedBoxPurple className="h-[16px] w-[16px]" />
            )}
            <p className="text-lg font-normal">
              Grade {grade?.level},{" "}
              {String(grade.amount).includes("399")
                ? "399k"
                : formatPriceCompact(grade?.amount)}
            </p>
          </div>
        ))}
      </div>
    </UserDetailContainer>
  );
};

export default Grades;
