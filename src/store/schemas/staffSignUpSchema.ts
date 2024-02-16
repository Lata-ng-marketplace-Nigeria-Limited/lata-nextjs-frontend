import { z } from "zod";
import { loginSchema } from "./loginSchema";
import { phoneNumberSchema } from "./phoneNumberSchema";

export const staffSignUpSchema = loginSchema.and(
  z
    .object({
      name: z
        .string()
        .nonempty("Please enter your full name.")
        .min(3, "Please enter a minimum of 3 characters."),
      position: z.string().nonempty("Please enter your position"),
      bankName: z.string().nonempty("Please enter your bank name"),
      accountNumber: z.string().nonempty("Please enter your account number"),
      accountName: z.string().nonempty("Please enter your account name"),
      address: z.string().nonempty("Please enter business location"),
      location: z.string().nonempty("Please enter your location"),
    })
    .and(phoneNumberSchema()),
);
