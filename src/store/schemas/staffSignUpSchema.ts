import { z } from "zod";
import { loginSchema } from "./loginSchema";
import { isNumberSchema, phoneNumberSchema } from "./phoneNumberSchema";

const accountNumberValidation = isNumberSchema(
  "Please enter a valid phone number",
).and(
  z.custom(
    (value: any) => {
      if (!value) return true;
      return value.length >= 10;
    },
    { message: "Please enter a valid account number" },
  ),
);

export const staffSignUpSchema = loginSchema.and(
  z
    .object({
      name: z
        .string()
        .nonempty("Please enter your full name.")
        .min(3, "Please enter a minimum of 3 characters."),
      position: z.string().nonempty("Please enter your position"),
      bankName: z.string().nonempty("Please enter your bank name"),
      accountNumber: z
        .string()
        .nonempty("Please enter your account number")
        .and(accountNumberValidation),
      accountName: z.string().nonempty("Please enter your account name"),
      address: z.string().nonempty("Please enter business location"),
    })
    .and(phoneNumberSchema()),
);
