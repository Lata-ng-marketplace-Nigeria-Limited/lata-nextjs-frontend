"use client";

import React, { useCallback, useId, useState } from "react";
import Input, { InputProps } from "../atom/Input";
import { cn } from "@/utils";
import { SearchIcon } from "lucide-react";

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
    const id = useId();
    const [focused, setFocused] = useState(false);

    const handleFocus = useCallback(() => {
      setFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setFocused(false);
    }, []);

    return (
      <div className={cn("relative w-full", wrapperClass)}>
        <SearchIcon
          className={cn(
            `
            absolute 
            right-2.5 
            top-1/2 
            h-3 
            w-3 
            -translate-y-1/2 
            transform 
            sm:right-4 
            sm:h-4 
            sm:w-4
          `,
            searchIconClass,
          )}
          // pathClass={cn("stroke-grey6")}
        />
        <input
          {...props}
          placeholder={"Search messages"}
          className={cn(
            `
           relative
           h-[35px]
           w-full
           rounded-[10px]
           bg-offwhite
           px-2.5
           outline-none
           sm:h-[50px]
           sm:px-4
           `,
            inputClass,
          )}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
