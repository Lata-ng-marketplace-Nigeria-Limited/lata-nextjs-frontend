"use client";

import { SelectInput } from "@components/input/SelectInput";
import { useCategory } from "@/hooks/useCategory";
import { cn } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { revalidateTag } from "next/cache";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const DashboardSelectCategories = () => {
  const { categoriesSelectData } = useCategory();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={"my-4"}>
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
    </div>
  );
};
