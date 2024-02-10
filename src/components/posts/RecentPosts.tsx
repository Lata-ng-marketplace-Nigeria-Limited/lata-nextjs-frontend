import React from "react";
import { Table } from "../table/Table";
import { Product } from "@/interface/products";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";

interface Props {
  reposts: Product[];
}

const RecentPosts = async (props: Props) => {
  return (
    <div>
      <div className="mb-10 text-2xl font-semibold">Recent Posts</div>

      <Table
        rowClassName="bg-white !my-10"
        tableClassName="bg-transparent"
        tdClassName="py-4 px-6"
        tableData={props?.reposts?.map((post) => {
          return {
            poster: (
              <div className="flex items-center gap-2">
                <Image
                  src={post?.user?.avatar || ""}
                  alt={"image of " + post?.user?.name}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <p>{post?.user?.name}</p>
              </div>
            ),
            location: post?.state,
            date: DateTime.fromISO(post?.createdAt).toFormat("dd LLL, yyyy"),
            posts: (
              <Link href={`/admin/product/${post.id}`} className="cursor-pointer text-primary">
                see post
              </Link>
            ),
          };
        })}
      />
    </div>
  );
};

export default RecentPosts;
