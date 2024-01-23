"use client";

import React, { useEffect, useState } from "react";
import startCase from "lodash/startCase";
import { cn, isOdd } from "@/utils";
import Paginate, { PaginateProps } from "@components/input/Paginate";

interface Props extends PaginateProps {
  tableData?: Array<{ [key: string]: any }>;
  hiddenColumns?: string[];
  format?: "default" | "compact";
  compactData?: { [key: string]: any };
  onRowClick?: (row: any) => void;
  onColumnClick?: (column: { key: string; rowData: any }) => void;
  keyNotCursor?: string[];
  uesPaginate?: boolean;
}

export const Table = (props: Props) => {
  const [keys, setKeys] = useState<string[]>([]);

  const showPagination =
    props.uesPaginate && props.meta && props.meta?.total > props.meta?.per_page;

  useEffect(() => {
    let array: string[] = [];
    if (props.format === "compact" && props.compactData) {
      array = Object.keys(props.compactData);
    }

    if (props.tableData) {
      array = props.tableData.length ? Object.keys(props.tableData[0]) : [];
    }
    const value = [
      ...array.filter(
        (key) => ![...(props.hiddenColumns || []), "rowData"]?.includes(key),
      ),
    ];
    setKeys(value);
    // console.log(props.meta);
  }, [
    props.compactData,
    props.format,
    props.hiddenColumns,
    props.tableData,
    props.meta,
  ]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {props.format !== "compact" ? (
              <>
                {keys.map((key, i) => (
                  <th key={i} scope="col" className="px-6 py-3">
                    {startCase(key)}
                  </th>
                ))}
              </>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {props.format === "compact" ? (
            <>
              {keys.map((key, i) => (
                <tr
                  className={cn({
                    "border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700":
                      isOdd(0),
                    "bg-white border-b dark:bg-gray-900 dark:border-gray-700":
                      !isOdd(0),
                    "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900":
                      !!props.onRowClick,
                  })}
                  key={i}
                  onClick={() =>
                    props.onRowClick?.(props.compactData?.[key]?.rowData)
                  }
                >
                  <td className="px-6 py-4">{startCase(key)}</td>
                  <td className="px-6 py-4">{props.compactData![key]}</td>
                </tr>
              ))}
            </>
          ) : (
            <>
              {props.tableData?.map((row, mainIndex) => (
                <tr
                  className={cn({
                    "border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700":
                      isOdd(mainIndex),
                    "bg-white border-b dark:bg-gray-900 dark:border-gray-700":
                      !isOdd(mainIndex),
                    "cursor-pointer": !!props.onRowClick,
                    "hover:bg-purple-100 dark:hover:bg-gray-900":
                      !!props.onRowClick || !!props.onColumnClick,
                  })}
                  key={mainIndex}
                  onClick={() =>
                    props.onRowClick?.(props.tableData?.[mainIndex]?.rowData)
                  }
                >
                  {keys.map((key, index) => {
                    if (index === 0) {
                      return (
                        <th
                          scope="row"
                          className={cn("px-6 py-4", {
                            "cursor-pointer":
                              !!props.onColumnClick &&
                              !props.keyNotCursor?.includes(key),
                          })}
                          key={index}
                          onClick={() =>
                            props.onColumnClick?.({
                              key,
                              rowData: props.tableData?.[mainIndex]?.rowData,
                            })
                          }
                        >
                          {row[key]}
                        </th>
                      );
                    } else {
                      return (
                        <td
                          className={cn("px-6 py-4", {
                            "cursor-pointer":
                              !!props.onColumnClick &&
                              !props.keyNotCursor?.includes(key),
                          })}
                          key={index}
                          onClick={() =>
                            props.onColumnClick?.({
                              key,
                              rowData: props.tableData?.[mainIndex]?.rowData,
                            })
                          }
                        >
                          {row[key]}
                        </td>
                      );
                    }
                  })}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      {showPagination ? (
        <div className={"my-6"}>
          <Paginate
            meta={props.meta}
            currentPage={props.currentPage}
            onPageChange={props.onPageChange}
            loading={props.loading}
          />
        </div>
      ) : null}
    </div>
  );
};
