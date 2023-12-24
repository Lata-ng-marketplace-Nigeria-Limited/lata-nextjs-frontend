"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

import { cn } from "@/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    icon?: React.ReactNode;
    iconClass?: string;
    hideIcon?: boolean;
    iconBefore?: React.ReactNode;
  }
>(
  (
    { className, children, iconBefore, hideIcon, iconClass, icon, ...props },
    ref,
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        `
      flex 
      min-h-[2rem] 
      sm:min-h-12
      px-4
      rounded-md
      text-xs
      sm:text-sm
      text-grey9
      placeholder:text-grey5
      border-solid
      border-grey5
      hover:border-grey7
      focus:border-grey7
      caret-primary
      disabled:bg-grey1
      disabled:cursor-not-allowed
      outline-none
      select-none
      gap-x-1
      
      
      w-full 
      items-center 
      justify-between 
      border 
      bg-white 
      py-2 
      ring-offset-white 
      focus:outline-none 
      disabled:opacity-50 
      dark:border-slate-800 
      dark:bg-slate-950 
      dark:placeholder:text-slate-400 
      group
      
    `,
        className,
      )}
      {...props}
    >
      {iconBefore ? (
        <SelectPrimitive.Icon asChild>{iconBefore}</SelectPrimitive.Icon>
      ) : null}

      {children}

      {hideIcon ? null : (
        <SelectPrimitive.Icon asChild>
          {icon || (
            <ChevronDown
              className={cn(
                "h-5 w-5 opacity-50 transform transition group-aria-[expanded=true]:rotate-180 rotate-0",
                iconClass,
                // props["aria-expanded"] && "transform rotate-180",
              )}
            />
          )}
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  ),
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      `
      px-2
      py-1.5
      text-xs
      text-grey7  
      sm:px-4
      sm:py-2.5
      sm:text-sm
      hover:bg-purp1
      focus:bg-purp1
      rounded-md
      cursor-pointer
      outline-none
      flex
      items-center
      
      relative 
      w-full 
      select-none 
      focus:text-slate-900 
      data-[disabled]:pointer-events-none 
      data-[disabled]:opacity-50 
      dark:focus:bg-slate-800 
      dark:focus:text-slate-50
      
      `,
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
