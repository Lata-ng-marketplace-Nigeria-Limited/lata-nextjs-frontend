import { FetchMeta } from "@/interface/general";
import { Product } from "@/interface/products";
import React from "react";
import TableWithRowGaps from "@components/table/TableWithRowGaps";
import { DateTime } from "luxon";
import Image from "next/image";
import TableTopArea from "./TableTopArea";
import Link from "next/link";

interface Props {
  data: Product[];
  meta: FetchMeta;
}
const AllPosts = (props: Props) => {
  return (
    <div>
      <TableTopArea title="All Posts" hideButton placeholder="Search posts" />
      <TableWithRowGaps
        isClickable
        tableData={props?.data?.map((post) => {
          return {
            poster: (
              <div className="flex items-center gap-2">
                <Image
                  src={post?.user?.avatar || ""}
                  alt={"image of " + post?.user?.name}
                  width={20}
                  height={20}
                  className="aspect-square rounded-full object-cover"
                />
                <p className="font-semibold">{post?.user?.name}</p>
              </div>
            ),
            location: <p>{post?.state}</p>,
            date: DateTime.fromISO(post?.createdAt).toFormat("dd LLL, yyyy"),
            posts: (
              <Link
                href={`/admin/product/${post.id}`}
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
