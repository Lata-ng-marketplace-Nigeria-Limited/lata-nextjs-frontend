import Button, { ButtonProp } from "@atom/Button";
import React, { SetStateAction, useEffect, useState } from "react";
import { cn, formatPrice } from "@/utils";

type DiscountBtnProp = {
  discount: number;
  amount: number;
  children?: undefined;
  text?: string;
};

type Props = Omit<ButtonProp, "children"> &
  (
    | DiscountBtnProp
    | {
        discount?: undefined;
        amount?: number;
        text: string;
        setAmountToPay: React.Dispatch<SetStateAction<number>>;
      }
  );

export const DiscountButton = ({ discount, amount, text, ...props }: Props) => {
  const [initialAmount, setInitialAmount] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);

  useEffect(() => {
    if (discount) {
      setDiscountedAmount(amount - (amount * discount) / 100);
      setInitialAmount(amount);
    } else {
      setDiscountedAmount(amount || 0);
      setInitialAmount(0);
    }
  }, [discount, amount]);

  return (
    <div className={"w-full"}>
      <Button
        {...(props as any)}
        className={cn(
          "w-full relative flex gap-x-3 justify-center",
          props.className,
        )}
      >
        {text || (
          <>
            <span className={"text-grey4 line-through empty:hidden"}>
              {initialAmount ? formatPrice(initialAmount) : ""}
            </span>
            <span className={"text-white"}>
              {formatPrice(discountedAmount)}
            </span>
          </>
        )}
      </Button>

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
      `)}
      >
        {discount ? `${discount}% OFF` : ""}
      </div>
    </div>
  );
};
