"use client";

import React from "react";
import { InputProps } from "../atom/Input";
import { cn } from "@/utils";
import { SearchIcon } from "@components/atom/icons/Search";

interface Props extends Omit<InputProps, "className"> {
  wrapperClass?: string;
  inputClass?: string;
  placeholder?: string;
  searchIconClass?: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput = React.forwardRef(
  (
    {
      wrapperClass,
      inputClass,
      placeholder,
      searchIconClass,
      setSearch,
      ...props
    }: Props,
    ref,
  ) => {
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
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
