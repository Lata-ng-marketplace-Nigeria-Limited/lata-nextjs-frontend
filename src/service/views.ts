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

export async function getViewsApi(type: ViewTypes, month?: string) {
  try {
    const typeToLowerCase = type.toLowerCase();
    let res = month
      ? await $http.get(`views/${typeToLowerCase}?month=${month}`)
      : await $http.get(`views/${typeToLowerCase}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
