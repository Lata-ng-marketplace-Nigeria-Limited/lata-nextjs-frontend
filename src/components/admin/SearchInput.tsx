"use client";

import React from "react";
import { InputProps } from "../atom/Input";
import { cn } from "@/utils";
import { SearchIcon } from "@components/atom/icons/Search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface Props extends Omit<InputProps, "className"> {
  wrapperClass?: string;
  inputClass?: string;
  placeholder?: string;
  searchIconClass?: string;
}

const SearchInput = React.forwardRef(
  (
    { wrapperClass, inputClass, placeholder, searchIconClass, ...props }: Props,
    ref,
  ) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
      console.log(`Searching... ${term}`);

      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
      <div className={cn(" relative w-full", wrapperClass)}>
        <SearchIcon
          className={cn(
            `
              absolute 
              left-2.5 
              top-1/2 
              z-10 
              h-3 
              w-3 
              -translate-y-1/2 
              transform 
              sm:left-4 
              sm:h-4
              sm:w-4
              `,
            searchIconClass,
          )}
          pathClass={cn("stroke-grey6")}
        />
        <input
          {...props}
          placeholder={placeholder || "Search messages"}
          className={cn(
            `
              relative
              h-[35px]
              w-full
              rounded-[10px]
            bg-offwhite
              px-2
              indent-6
              outline-none
              sm:h-[50px]
              sm:px-4
              `,
            inputClass,
          )}
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => handleSearch(e.target.value.toLowerCase())}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
