"use client";

import { SelectInput } from "@components/input/SelectInput";
import { useCategory } from "@/hooks/useCategory";
import { cn } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { revalidateTag } from "next/cache";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "@atom/Button";
import Modal from "./Modal";
import Category from "../product/Category";

export const DashboardSelectCategories = () => {
  const { categoriesSelectData, categories } = useCategory();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal((prev) => !prev);
  };

  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      // console.log("unauth");
    },
  });

  // useEffect(() => {
  //   console.log({ data, status });
  // }, [data, status]);

  const handleCategoryChange = (id: string) => {
    const params = new URLSearchParams(searchParams);
    if (id && id !== "all") {
      params.set("category", id);
    } else {
      params.delete("category");
    }
    params.delete("subcategory");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={"my-4 flex items-center justify-between"}>
      <SelectInput
        options={[
          {
            label: "All Categories",
            value: "all",
          },
          ...categoriesSelectData,
        ]}
        placeholder={"Select category"}
        inputClass={cn(
          `min-w-[150px] sm:min-w-[174px] w-fit text-xs sm:text-sm rounded-[12px] border-primary hover:border-primary text-primary`
        )}
        value={searchParams.get("category")?.toString()}
        onValueChange={handleCategoryChange}
        defaultValue={searchParams.get("category")?.toString()}
      />

      <Button
        format="primary"
        className="min-w-[150px] sm:min-w-[174px]"
        onClick={handleShowModal}
      >
        BUY HERE
      </Button>

      <Modal
        isShown={showModal}
        setIsShown={setShowModal}
        // maxWidth="calc(100vw - 30%)"
        contentClass="max-h-[calc(100vh-50px)] !max-w-screen"
      >
        <div className="grid grid-cols-1 xls:grid-cols-2 gap-8 md:gap-14 bg-white py-4 md:grid-cols-3 lg:grid-cols-5">
          {categories
            ?.filter((category) => category.name.toLowerCase() !== "others")
            .map((category) => (
              <Category
                key={category.id}
                data={category}
                onModalClose={handleShowModal}
              />
            ))}
        </div>
      </Modal>
    </div>
  );
};
