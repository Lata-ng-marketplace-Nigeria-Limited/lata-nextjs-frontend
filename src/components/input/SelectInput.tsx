"use client";

import React, { useCallback, useState } from "react";
import { SearchOption, SelectOptionData } from "@/interface/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { cn } from "@/utils";
import Small from "@atom/Small";

export interface SelectInputProps {
  inputClass?: string;
  options?: SearchOption[];
  optionsGroup?: SelectOptionData[];
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  errorMessage?: string;
  errorClass?: string;
  hideIcon?: boolean;
  iconBefore?: React.ReactNode;
  contentWidth?: string;
  sameWidth?: boolean;
  iconClass?: string;
  listAreaClass?: string;
  wrapperClass?: string;
  name?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  disabled?: boolean;
  emptyMessage?: string;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

export const SelectInput = ({
  inputProps,
  name,
  value,
  disabled,
  placeholder,
  emptyMessage,
  errorMessage,
  options,
  inputClass,
  errorClass,
  setValue,
  iconClass,
  hideIcon,
  iconBefore,
  listAreaClass,
  onOpenChange,
  defaultOpen,
  onValueChange,
  optionsGroup,
  defaultValue,
  wrapperClass,
}: SelectInputProps) => {
  const [selectedValue, setSelectedValue] = useState("");

  const itemDefaultClass = useCallback(
    (itemValue: string, isDisabled?: boolean) =>
      cn({
        "bg-primary text-white hover:bg-primary focus:bg-primary focus:text-white":
          selectedValue === itemValue,
        "pointer-events-none text-grey5": isDisabled,
      }),
    [selectedValue],
  );

  return (
    <div className={cn("flex flex-col w-full gap-y-1", wrapperClass)}>
      <Select
        name={name || inputProps?.name}
        // open={true}
        value={value || inputProps?.value || ("" as any)}
        disabled={disabled}
        onValueChange={(value) => {
          if (!value) return;
          onValueChange && onValueChange(value);
          setValue && setValue(value);
          setSelectedValue(value);
          const e = {
            target: {
              name: name || inputProps?.name,
              value,
            },
          };
          inputProps?.onChange?.(e as any);
        }}
        required={inputProps?.required}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
        // defaultValue={defaultValue || value || inputProps?.value || ("" as any)}
        {...(defaultValue
          ? {
              defaultValue,
            }
          : {})}
      >
        <SelectTrigger
          className={cn(
            {
              "border-primary w-full hover:border-primary focus:border-primary active:border-primary":
                !!selectedValue || !!value,
            },
            inputClass,
          )}
          iconClass={iconClass}
          hideIcon={hideIcon}
          iconBefore={iconBefore}
        >
          <SelectValue
            className={"truncate text-ellipsis overflow-hidden"}
            placeholder={placeholder}
          />
        </SelectTrigger>

        <SelectContent
          className={cn(
            `
               shadow-drop-down
               bg-white
               transition
               max-h-[300px]
            `,
            listAreaClass,
          )}
        >
          {optionsGroup?.map((group, i) => (
            <SelectGroup key={i}>
              <SelectLabel
                className={cn(`
                    px-2
                    uppercase
                    text-xs
                    sm:text-sm
               `)}
              >
                {group.label}
              </SelectLabel>
              {group.options.map((option, index) => (
                <SelectItem
                  className={itemDefaultClass(option.value, option.disabled)}
                  value={option.value}
                  disabled={option.disabled}
                  key={index}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
          {options?.map((option, index) => (
            <SelectItem
              className={itemDefaultClass(option.value, option.disabled)}
              value={option.value}
              disabled={option.disabled}
              key={index}
            >
              {option.label}
            </SelectItem>
          ))}

          {!options?.length && !optionsGroup?.length ? (
            <SelectItem
              className={itemDefaultClass("null")}
              value={"null"}
              disabled
            >
              {emptyMessage || "No options available"}
            </SelectItem>
          ) : null}
        </SelectContent>
      </Select>
      <Small className={cn(`text-danger text-[11px] sm:text-xs `, errorClass)}>
        {errorMessage}
      </Small>
    </div>
  );
};
