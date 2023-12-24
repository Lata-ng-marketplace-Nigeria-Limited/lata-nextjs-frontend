import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .nonempty("Please enter your email.")
      .email("Enter a valid email."),
    password: z
      .string()
      .nonempty("Please enter your password.")
      .min(8, "You password must have 8 characters or more."),
  })
