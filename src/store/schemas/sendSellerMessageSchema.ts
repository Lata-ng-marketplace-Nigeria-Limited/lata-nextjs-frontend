import { z } from "zod";

export const sendSellerMessageSchema = z.object({
  message: z.string().nonempty("Message is required"),
});
