"use client";

import ComboBox from "@components/input/ComboBox";
import { SelectInput } from "@components/input/SelectInput";
import { MapPinIcon } from "@atom/icons/MapPin";
import { nigerianStates } from "@/store/data/location";
import { cn } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  recentSearches?: string[];
}

export const SearchProductForm = ({ recentSearches }: Props) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("any");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();
  const isSmall = useMediaQuery("(max-width: 370px)");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 3) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    if (location !== "any") {
      params.set("loc", location);
    } else {
      params.delete("loc");
    }
    const url = `/search?${params.toString()}`;
    if (pathname.includes("/search")) {
      replace(url);
    } else {
      push(url);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q")?.toString();
    const loc = searchParams.get("loc")?.toString();

    if (!pathname.includes("/search")) {
      setQuery("");
      setLocation("any");
      return;
    }

    if (q) {
      setQuery(q);
    }
    if (loc) {
      setLocation(loc);
    }
  }, [searchParams, pathname]);

  return (
    <div className={"w-full"}>
      <form className={" flex w-fit items-center gap-x-2"} onSubmit={onSubmit}>
        <ComboBox
          options={recentSearches || []}
          value={query}
          setValue={setQuery}
          required
          wrapperClass={
            "w-full max-w-[200px] sm:max-w-full sm:w-[300px] md:w-[350px] lg:w-[400px]"
          }
          placeholder={isSmall ? "Search..." : "Search for products here"}
          hideNoResult
          name={"query"}
          defaultValue={searchParams.get("q")?.toString()}
          pattern=".{3,}"
          title="Please enter at least 3 characters"
        />

        <SelectInput
          iconBefore={<MapPinIcon className="h-[12px] w-[12px]" />}
          value={location}
          options={[{ value: "any", label: "Any" }, ...nigerianStates]}
          contentWidth={"115px"}
          hideIcon
          name={"location"}
          defaultValue={searchParams.get("loc")?.toString()}
          setValue={setLocation}
          // disabled={loading}
          sameWidth={false}
          wrapperClass={"w-fit"}
          inputClass={cn(`
                h-[25px] 
                sm:h-[36px]
                px-2
                text-grey9
                bg-offwhite
                border-none
                w-fit
                text-[10px]
                min-w-[55px]
            `)}
          listAreaClass={cn(`
              w-fit
          `)}
        />
      </form>
    </div>
  );
};
