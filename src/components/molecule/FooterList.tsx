import { cn } from "@/utils";
import { FooterLink } from "@/store/data/footer";
import ALink from "@/components/atom/ALink";
import React from "react";

type ListLinks = {
  links: true;
  list: Array<FooterLink>;
};

type ListJSX = {
  links?: false;
  list: Array<React.ReactNode>;
};

type Props = {
  title: string;
  wrapperClass?: string;
  titleClass?: string;
  listClass?: string;
} & (ListLinks | ListJSX);

export default function FooterList(props: Props) {
  return (
    <ul
      className={cn(
        `
        flex
        flex-col
        gap-y-3
        tablet:gap-y-6 
      `,
        props.wrapperClass
      )}
    >
      <li
        className={cn(
          `
          font-semibold
          text-grey5
          text-sm
          tablet:text-base
          whitespace-nowrap
        `,
          props.titleClass
        )}
      >
        {props.title}
      </li>

      {props.list.map((item, i) => (
        <li
          className={cn(
            `
              text-offwhite
              text-xs
              tablet:text-sm
              max-w-[24ch]
            `,
            props.listClass
          )}
          key={i}
        >
          {typeof item === "object" &&
          item &&
          "title" in item &&
          "href" in item ? (
            <ALink
              href={item.href}
              className={"text-offwhite text-xs sm:text-xs tablet:text-sm"}
            >
              {item.title}
            </ALink>
          ) : (
            item
          )}
        </li>
      ))}
    </ul>
  );
}
