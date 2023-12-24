import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Auth({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={"max-w-[1440px] mx-auto"}>{children}</div>;
}
