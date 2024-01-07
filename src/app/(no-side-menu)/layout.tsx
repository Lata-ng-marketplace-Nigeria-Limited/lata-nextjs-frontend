import React, { Suspense } from "react";
import { cn } from "@/utils";
import Header from "@/components/organism/Header";
import Footer from "@/components/organism/Footer";
import { GetUser } from "@atom/GetUser";

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={"h-full bg-white"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <Header />
      <div
        className={cn(`       
           mx-auto
           h-full 
           min-h-[calc(100vh-50px-200px)] 
           w-full 
           max-w-[1440px] 
           px-1 
           py-[40px] 
           xs:px-2.5 
           sm:px-4
           
           md:min-h-[calc(100vh-60px-200px)] 
           md:px-6
        `)}
      >
        {children}
      </div>
      <Footer />
    </main>
  );
}
