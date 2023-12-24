import { z } from "zod";
import { checkIfInputNumber } from "../../utils";

export const isNumberSchema = (error: string) =>
  z.custom((value) => {
    if (!value) return true;
    return checkIfInputNumber(value as any);
  }, error);

export const phoneNumberSchema = (optional: boolean = false) => {
  return optional
    ? z.object({
        phoneNumber: z.string().and(customPhoneValidation),
      })
    : z.object({
        phoneNumber: z
          .string()
          .nonempty("Please enter your phone number.")
          .and(customPhoneValidation),
      });
};

const customPhoneValidation = isNumberSchema(
  "Please enter a valid phone number"
).and(
  z
    .custom((value: any) => {
      if (!value) return true;
      return value.length >= 11;
    }, "Please enter a minimum of 11 characters in format 2347123456789 or 07123456789")
    .and(
      z.custom((value: any) => {
        if (!value) return true;
        return value.length <= 13;
      }, "Please enter a maximum of 13 characters in format 2347123456789 or 07123456789")
    )
);
