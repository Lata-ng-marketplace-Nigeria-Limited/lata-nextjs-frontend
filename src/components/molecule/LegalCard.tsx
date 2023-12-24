import { cn } from "@/utils";
import Link from "next/link";
import { LegalDoc } from "@/interface/legal";
import { ChevronRight } from "lucide-react";

interface LegalCardProps {
  doc?: LegalDoc;
}

export const LegalCard = ({ doc }: LegalCardProps) => {
  return (
    <Link
      className={cn(`
        bg-white
        rounded-md
        shadow-md
        border
        border-grey5
        border-solid
        p-4
        text-xs
        xs:text:sm
        sm:text-base
        cursor-pointer
        block
        capitalize
        flex
        items-center
        justify-between
    `)}
      href={"/legal-docs/edit/" + doc?.id}
    >
      {doc?.name}
      <ChevronRight
        className={"w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 text-grey8"}
      />
    </Link>
  );
};
