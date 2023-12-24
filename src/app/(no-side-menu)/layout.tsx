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
    <main className={"bg-white h-full"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <Header recentSearches={[]} />
      <div
        className={cn(`       
           h-full
           px-1 
           xs:px-2.5 
           sm:px-4 
           md:px-6 
           py-[40px] 
           w-full 
           mx-auto 
           max-w-[1440px]
           
           min-h-[calc(100vh-50px-200px)] 
           md:min-h-[calc(100vh-60px-200px)]
        `)}
      >
        {children}
      </div>
      <Footer />
    </main>
  );
}
