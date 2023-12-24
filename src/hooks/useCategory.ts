"use client";

import { useGeneralStore, useLocalStore } from "@/store/states/localStore";
import { useEffect, useState } from "react";
import { getAllCategoriesApi } from "@/api/category";
import { SearchOption } from "@/interface/input";

export const useCategory = () => {
  // const [storeData, setStoreData] = useAtom(localAtom);
  const { categories, setCategories } = useLocalStore();
  const { hasSetCategories, setHasSetCategories } = useGeneralStore();
  // const [session, setSession] = useAtom(sessionAtom);
  const [categoriesSelectData, setCategoriesSelectData] = useState<
    SearchOption[]
  >([]);

  useEffect(() => {
    if (hasSetCategories) return;
    (async () => {
      const categories = await getAllCategoriesApi();
      if (!categories || !categories.length) return;
      setCategories(categories);
      setHasSetCategories(true);
    })();
  }, [categories, hasSetCategories, setHasSetCategories, setCategories]);

  useEffect(() => {
    if (!categories?.length) return;
    const categoryOptions = categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
    setCategoriesSelectData(categoryOptions);
  }, [categories]);

  return {
    categories: categories || [],
    categoriesSelectData,
  };
};
