"use server";

import { revalidateTag } from "next/cache";

export const revalidateProductsTag = async () => {
    revalidateTag("dashboard_products");
};

export const revalidateStatesTag = async () => {
    revalidateTag("all_states");
};
