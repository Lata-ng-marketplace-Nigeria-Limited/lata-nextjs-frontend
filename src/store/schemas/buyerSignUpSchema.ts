import { z } from "zod";
import { loginSchema } from "./loginSchema";
import { phoneNumberSchema } from "./phoneNumberSchema";

export const buyerSignUpSchema = loginSchema.and(
  z
    .object({
      name: z
        .string()
        .min(1, "Please enter your full name.")
        .min(3, "Please enter a minimum of 3 characters."),
      buyerRole: z.string().min(1, "Please select what best describes you."),
    })
    .and(phoneNumberSchema(true)),
);
