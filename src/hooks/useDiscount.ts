import { formatPrice } from "@/utils";
import { useEffect, useState } from "react";

interface IDiscount {
  discount: number;
  amount: number;
}

export const useDiscount = (discountDetails: IDiscount) => {
  const { discount, amount } = discountDetails;

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

  return { initialAmount, discountedAmount: formatPrice(discountedAmount) };
};
