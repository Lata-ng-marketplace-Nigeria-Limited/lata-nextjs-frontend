import z from "zod";

export const loanSchema = z.object({
  amount: z
    .string()
    .min(1, "Loan amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid amount greater than 0",
    }),
  duration: z.string().min(1, "Loan duration is required"),
  monthlyIncome: z
    .string()
    .min(1, "Monthly income is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid monthly income",
    }),
  employmentStatus: z.string().min(1, "Employment status is required"),
  purpose: z.string().min(6, "Purpose of loan must be at least 6 characters"),
  additionalInfo: z.string().optional(),
});
