"use client";

import React from "react";
import { Product } from "@/interface/products";
import { DateTime } from "luxon";
import Link from "next/link";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import { FetchMeta } from "@/interface/general";
import {
  DASHBOARD_PRODUCT_ROUTE,
  DASHBOARD_PROTECTED_SELLER_ROUTE,
} from "@/constants/routes";
import AppAvatar from "../molecule/Avatar";

interface Props {
  reposts: Product[];
  meta: FetchMeta;
}

const RecentPosts = async (props: Props) => {
  return (
    <>
      <TableWithRowGaps
        usePaginate
        meta={props.meta}
        emptyTableTitle="No Recent Posts"
        emptyTableDescription="All newly uploaded products yet to be reviewed will appear here"
        tableData={props?.reposts?.map((post) => {
          return {
            poster: (
              <div className="flex items-center gap-2">
                <AppAvatar
                  name={post?.user?.name}
                  src={post?.user?.avatar}
                  className="h-[30px] w-[30px] sm:h-[30px] sm:w-[30px]"
                  initialsClass="font-normal text-xs sm:text-xs"
                />

                <Link
                  href={DASHBOARD_PROTECTED_SELLER_ROUTE + "/" + post.user?.id}
                  className="font-semibold hover:text-primary"
                >
                  {post?.user?.name}
                </Link>
              </div>
            ),
            location: <p>{post?.state}</p>,
            date: DateTime.fromISO(post?.createdAt).toFormat("dd LLL, yyyy"),
            posts: (
              <Link
                href={`${DASHBOARD_PRODUCT_ROUTE}/${post.id}`}
                className="cursor-pointer text-primary"
              >
                see post
              </Link>
            ),
          };
        })}
      />
    </>
  );
};

export default RecentPosts;
