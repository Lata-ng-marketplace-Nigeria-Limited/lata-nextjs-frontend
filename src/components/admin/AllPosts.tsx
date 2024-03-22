import { FetchMeta } from "@/interface/general";
import { Product } from "@/interface/products";
import React from "react";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import { DateTime } from "luxon";
import TableTopArea from "./TableTopArea";
import Link from "next/link";
import {
  DASHBOARD_PRODUCT_ROUTE,
  DASHBOARD_SELLER_PROFILE_ROUTE,
} from "@/constants/routes";
import AppAvatar from "../molecule/Avatar";

interface Props {
  data: Product[];
  meta: FetchMeta;
}
const AllPosts = (props: Props) => {

  return (
    <div>
      <TableTopArea
        title="All Posts"
        hideButton
        placeholder="Search posts"
      />
      <TableWithRowGaps
        isClickable
        tableData={props.data?.map((post) => {
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
                  href={DASHBOARD_SELLER_PROFILE_ROUTE + "/" + post.user?.id}
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
                href={DASHBOARD_PRODUCT_ROUTE + "/" + post?.id}
                className="cursor-pointer text-primary"
              >
                see post
              </Link>
            ),
          };
        })}
        usePaginate
        meta={props.meta}
      />
    </div>
  );
};

export default AllPosts;
