import { Category } from "@/interface/products";

export const renameCategories = (category: Category) => {
  switch (category.name) {
    case "Agric/Food":
      return "Agric & Food";

    case "Phones, Computer and Gadgets":
      return "Gadgets";

    case "Cars/Vehicles":
      return "Cars & Vehicles";

    case "Medical/Equipment":
      return "Medicals";

    case "Electrical/Electronics":
      return "Electronics";

    case "Home/Office and Kitchen Accessories":
      return "Home Accessories";

    default:
      return category.name;
  }
};
