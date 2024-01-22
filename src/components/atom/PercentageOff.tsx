import { cn } from "@/utils";
import React from "react";

interface Props {
  discount: number;
  className?: string;
}

const PercentageOff = (props: Props) => {
  return (
    <div
      className={cn(`
text-xs 
text-white 
bg-danger 
rounded-[3px]
px-3
py-[5px]
w-max
empty:hidden
ml-auto
mr-[25px]
-mt-[3px]
${props.className}
`)}
    >
      {props?.discount ? `${props?.discount}% OFF` : ""}
    </div>
  );
};

export default PercentageOff;
