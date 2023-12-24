import { z } from "zod";
import { loginSchema } from "./loginSchema";
import { phoneNumberSchema } from "./phoneNumberSchema";

export const sellerSignUpSchema = loginSchema.and(
  z
    .object({
      name: z
        .string()
        .nonempty("Please enter your full name.")
        .min(3, "Please enter a minimum of 3 characters."),
      address: z.string().nonempty("Please enter business location"),
      aboutBusiness: z.string().nonempty("Please enter about business"),
    })
    .and(phoneNumberSchema())
);
