"use client";

import React, { SetStateAction, useId } from "react";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { cn } from "@/utils";

interface Props {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  labelClass?: string;
  name?: string;
  setChecked?: React.Dispatch<SetStateAction<boolean>>;
  wrapperClass?: string;
  disabled?: boolean;
  id?: string;
}

export const Toggle = ({
  label,
  labelClass,
  wrapperClass,
  disabled,
  name,
  checked,
  setChecked,
  onChange,
  id,
}: Props) => {
  const defaultId = useId();
  return (
    <div
      className={cn(
        `
        justify-between 
        items-center
        flex
        gap-x-2
      `,
        wrapperClass,
      )}
    >
      <Label
        className={cn(
          `
          text-xs 
          tablet:text-sm 
          empty:hidden 
          font-normal 
          text-grey9 
          cursor-pointer
        `,
          labelClass,
        )}
        htmlFor={id || defaultId}
      >
        {label}
      </Label>
      <Switch
        id={id || defaultId}
        checked={checked}
        name={name}
        disabled={disabled}
        onCheckedChange={(isChecked) => {
          console.log("e.target.checked", isChecked);
          onChange?.(isChecked);
          setChecked?.(isChecked);
        }}
      />
    </div>
  );
};
