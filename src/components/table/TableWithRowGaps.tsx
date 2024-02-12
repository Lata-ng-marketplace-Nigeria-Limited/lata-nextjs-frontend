"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import Paginate, { PaginateProps } from "@components/input/Paginate";
import { cn } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EmptyTable from "./EmptyTable";

interface Props extends PaginateProps {
  tableData: Array<{ [key: string]: any }>;
  hiddenColumns?: string[];
  usePaginate?: boolean;
  isClickable?: boolean;
  onRowClick?: (row: any) => void;
  emptyTableTitle?: string;
  emptyTableDescription?: string;
}

const TableWithRowGaps = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [keys, setKeys] = useState<string[]>([]);

  const showPagination =
    props.usePaginate && props.meta && props.meta?.total > props.meta?.per_page;

  const handlePageChange = (toPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", toPage + "");
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    let array: string[] = [];
    if (props.tableData) {
      array = props.tableData.length ? Object.keys(props.tableData[0]) : [];
    }

    const value = [
      ...array.filter(
        (key) => ![...(props.hiddenColumns || []), "rowData"]?.includes(key),
      ),
    ];
    setKeys(value);
  }, [props.hiddenColumns, props.meta, props.tableData]);

  const onRowClick = (row: any) => {
    if (!props.isClickable) return;
    console.log(row);
    props.onRowClick?.(row);
  };

  return (
    <>
      {props.tableData && props.tableData.length > 1 ? (
        <Table className="border-collapse text-grey10">
          <TableHeader>
            <TableRow>
              {keys?.map((key, index) => (
                <TableHead
                  key={"TableHead" + index}
                  className="font-semibold capitalize"
                >
                  {key}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="">
            {props.tableData?.map((row, mainIndex) => (
              <React.Fragment key={"TableRow" + mainIndex}>
                <TableRow
                  className={cn(
                    { "cursor-pointer": props.isClickable },
                    "border-[0.6px] border-solid border-grey1",
                  )}
                  onClick={() => onRowClick(row)}
                >
                  {keys?.map((key, index) => (
                    <TableCell key={"TableCell" + index}>{row[key]}</TableCell>
                  ))}
                </TableRow>
                <TableRow className="border border-x-0 border-transparent">
                  <div className="h-2 "></div>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyTable
          title={props.emptyTableTitle}
          description={props.emptyTableDescription}
        />
      )}

      {showPagination ? (
        <div className={"my-6"}>
          <Paginate
            meta={props.meta}
            onPageChange={handlePageChange}
            currentPage={Number(searchParams.get("page") || 1)}
            loading={props.loading}
          />
        </div>
      ) : null}
    </>
  );
};

export default TableWithRowGaps;
