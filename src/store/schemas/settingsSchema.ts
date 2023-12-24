import { z } from "zod";
import { loginSchema } from "./loginSchema";
import { phoneNumberSchema } from "./phoneNumberSchema";

export const settingsSchema = z
  .object({
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    address: z.string(),
    aboutBusiness: z.string(),
    email: z.string(),
    name: z
      .string()
      .nonempty("Please enter your full name.")
      .min(3, "Please enter a minimum of 3 characters."),
  })
  .and(phoneNumberSchema(true));
