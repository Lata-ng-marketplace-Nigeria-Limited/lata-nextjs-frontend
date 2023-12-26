import { CreateViewTypes, ViewTypes } from "@/interface/views";
import { $http } from "./axios";

export async function createViewApi(
  type: ViewTypes,
  productId: string,
  userId: string
) {
  try {
    const viewDetails: CreateViewTypes = {
      type,
      productId,
      userId,
    };
    const res = await $http.post("views", viewDetails);
    return res;
  } catch (error) {
    console.log(error);
  }
}