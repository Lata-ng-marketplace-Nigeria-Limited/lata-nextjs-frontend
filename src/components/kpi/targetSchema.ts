import { isNumberSchema } from "@/store/schemas/phoneNumberSchema";
import { z } from "zod";

export const createTargetSchema = z.object({
  amount: z.string().and(isNumberSchema("Please enter a valid number")),
  salary: z.string().and(isNumberSchema("Please enter a valid number")),
});