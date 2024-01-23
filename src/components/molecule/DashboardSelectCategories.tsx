"use client";

import { SelectInput } from "@components/input/SelectInput";
import { useCategory } from "@/hooks/useCategory";
import { cn } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { revalidateTag } from "next/cache";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "@atom/Button";
import Category from "@components/product/Category";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const DashboardSelectCategories = () => {
  const { categoriesSelectData, categories } = useCategory();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const params = new URLSearchParams(searchParams);

  const handleShowModal = () => {
    setShowModal((prev) => !prev);
  };

  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      // console.log("unauth");
    },
  });

  useEffect(() => {
    if (params.has("category")) {
      setSelectedCategory(params.get("category") || null);
    } else {
      setSelectedCategory(null);
    }

    if (params.has("subcategory")) {
      setSelectedSubcategory(params.get("subcategory") || null);
    } else {
      setSelectedSubcategory(null);
    }
  }, [params]);

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
    <div
      className={
        "my-4 flex flex-col items-start justify-between gap-4 xls:flex-row xls:items-center"
      }
    >
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
          `min-w-[150px] sm:min-w-[174px] w-fit text-xs sm:text-sm rounded-[12px] border-primary hover:border-primary text-primary`,
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

      <Dialog open={showModal} modal={true}>
        <DialogContent
          className="max-h-[calc(100vh-16px)] !w-screen !max-w-[calc(100vw-50px)] overflow-y-auto rounded-[6px] px-[16px] py-[12px] sm:!w-fit sm:!max-w-fit sm:px-[45px] sm:py-[24px]"
          onPointerDownOutside={() => setShowModal(false)}
          onEscapeKeyDown={() => setShowModal(false)}
        >
          <div className="grid grid-cols-2 gap-8 bg-white py-4 sm:grid-cols-3 sm:gap-14 lg:grid-cols-5">
            {categories
              ?.filter((category) => category.name.toLowerCase() !== "others")
              .map((category) => (
                <Category
                  key={category.id}
                  data={category}
                  onModalClose={handleShowModal}
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                />
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
