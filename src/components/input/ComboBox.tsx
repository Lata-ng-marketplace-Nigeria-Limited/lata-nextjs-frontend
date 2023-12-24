import React, { SetStateAction, useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { cn } from "@/utils";
import { SearchIcon } from "@atom/icons/Search";
import Button from "@atom/Button";

interface Props {
  wrapperClass?: string;
  controlClass?: string;
  options: string[];
  value?: string;
  setValue?: React.Dispatch<SetStateAction<string>>;
  onSearchClick?: (value: string) => void;
  placeholder?: string;
  buttonClass?: string;
  searchIconClass?: string;
  searchIconPathClass?: string;
  inputClass?: string;
  disabled?: boolean;
  hideNoResult?: boolean;
  name?: string;
  required?: boolean;
  defaultValue?: string;
  pattern?: string;
  title?: string;
}

export default function ComboBox(props: Props) {
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? props.options
      : props.options.filter((person) => {
          return person.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      defaultValue={props.defaultValue}
      value={props.value}
      onChange={props.setValue}
      name={props.name}
    >
      <div className={cn(`relative w-full w-[1000px]`, props.wrapperClass)}>
        <div className="relative flex w-full cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:text-sm">
          <Combobox.Input
            required={props.required}
            className={cn(`
              w-full 
              border 
              border-black 
              py-2 
              pl-3 
              pr-1 
              leading-5 
              text-gray-900 
              
              h-[25px] 
              sm:h-[36px]
              rounded-[5px]
              bg-offwhite
              px-2.5 
              text-xs
              outline-none
              border-none
              hover:border-none
              focus:border-none
              active:border-none
              focus:ring-transparent
            `)}
            placeholder={props.placeholder}
            onChange={(event) => {
              setQuery(event.target.value);
              props.setValue?.(event.target.value);
            }}
            pattern={props.pattern}
            title={props.title}
          />
          <Button
            format={"primary"}
            className={cn(
              `
              rounded-md
              py-1.5
              px-1
              
              sm:py-2.5
              sm:px-2
              h-[25px] 
              sm:h-[36px]
            `,
              props.buttonClass,
            )}
            aria-label={"Search"}
            disabled={props.disabled}
            type={"submit"}
          >
            <SearchIcon
              className={cn(
                `
              w-3
              h-3
              sm:w-4
              sm:h-4
            `,
                props.searchIconClass,
              )}
              pathClass={props.searchIconPathClass}
            />
          </Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => {}}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.length === 0 && query !== "" ? (
              <>
                {props.hideNoResult ? (
                  ""
                ) : (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                )}
              </>
            ) : (
              filteredPeople.map((person) => (
                <Combobox.Option
                  key={person}
                  className={({ active }) =>
                    cn(
                      `
                      relative
                      select-none
                      px-2
                      py-1.5
                      text-xs
                      text-grey7
                      sm:px-3
                      sm:py-2.5
                      sm:text-sm
                      hover:bg-purp1
                      rounded-md
                      cursor-pointer`,
                      {
                        "bg-primary text-white hover:bg-primary":
                          person === props.value,
                      },
                    )
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person}
                      </span>
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
