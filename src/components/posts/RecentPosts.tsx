import React from "react";
import { Product } from "@/interface/products";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import TableWithRowGaps from "@components/table/TableWithRowGaps";

interface Props {
  reposts: Product[];
}

const RecentPosts = async (props: Props) => {
  return (
    <TableWithRowGaps
      usePaginate
      tableData={props?.reposts?.map((post) => {
        return {
          poster: (
            <div className="flex items-center gap-2">
              <Image
                src={post?.user?.avatar || ""}
                alt={"image of " + post?.user?.name}
                width={20}
                height={20}
                className="rounded-full"
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
    />
  );
};

export default RecentPosts;
