import { z } from "zod";
import { checkIfInputNumber } from "@/utils";

export const isPriceSchema = (error: string) =>
  z.custom((value) => {
    if (!value) return true;
    const price = String(value).replace(/[^0-9]/g, "");

    return checkIfInputNumber(price);
  }, error);

export const createProductSchema = z.object({
  name: z.string().min(1, "Please enter a product name."),
  price: z
    .string()
    .min(1, "Please enter a price")
    .and(isPriceSchema("Please enter a valid price")),
  state: z.string().min(1, "Please select your state."),
  city: z.string().min(1, "Please select your city."),
  description: z
    .string()
    .min(1, "Please enter a description.")
    .min(6, "Please enter a description of at least 6 characters."),
  categoryId: z.string().min(1, "Please select a category."),
  subCategoryId: z.string().min(1, "Please select a subcategory."),
  productType: z.string().min(1, "Please select a product type."),
  discount: z.string().optional().nullable(),
});
