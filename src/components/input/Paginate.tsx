"use client";

import { FetchMeta } from "@/interface/general";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface PaginateProps {
  currentPage?: number;
  meta?: FetchMeta;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

export default function Paginate(props: PaginateProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const total = props.meta?.total || 0;
  const perPage = props.meta?.per_page || 10;
  const offset = (props.currentPage || 1) - 1;
  const start = offset * perPage + 1;
  const end =
    offset * perPage + perPage > total ? total : offset * perPage + perPage;

  const handlePageChange = (toPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", toPage + "");
    replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChangeProps = (toPage: number) => {
    if (props.onPageChange) props.onPageChange(toPage);
    if (!props.onPageChange) handlePageChange(toPage);
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {start}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {end}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {total}
          </span>{" "}
          Entries
        </span>

        <div className="inline-flex mt-2 xs:mt-0">
          <button
            disabled={props.loading || props.currentPage === 1}
            onClick={() => handlePageChangeProps((props.currentPage || 1) - 1)}
            className="flex disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Prev
          </button>
          <button
            disabled={props.loading || end >= total}
            onClick={() => handlePageChangeProps((props.currentPage || 1) + 1)}
            className="flex disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
