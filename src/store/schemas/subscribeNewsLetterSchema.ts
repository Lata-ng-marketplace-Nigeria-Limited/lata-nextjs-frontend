import z from "zod";

export const subscribeNewsLetterSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email.")
    .min(1, "Please enter your email."),
});
