"use server";

import { revalidateTag } from "next/cache";

export const revalidateProductsTag = async () => {
    revalidateTag("dashboard_products", "default");
};

export const revalidateStatesTag = async () => {
    revalidateTag("all_states", "default");
};
