import React, { Suspense } from "react";
import { cn } from "@/utils";
import Header from "@/components/organism/Header";
import SideMenu from "@/components/organism/SideMenu";
import Footer from "@/components/organism/Footer";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { GetUser } from "@atom/GetUser";
import { getRecentSearchesApi } from "@/api/product";

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  const recentSearches = await getRecentSearchesApi();
  return (
    <main className={"h-full bg-white"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <Header recentSearches={recentSearches} />
      <div
        className={cn(`
           flex
           h-full
        `)}
      >
        <SideMenu role={session?.role} isLoggedIn={!!session?.user} />

        <div
          className={cn(
            `
            mx-auto 
            h-full 
            min-h-[calc(100vh-50px-200px)] 
            w-full 
            max-w-[1202px] 
            px-1
            py-[10px] 
            xs:px-2.5
            sm:px-4 
            md:min-h-[calc(100vh-60px-200px)] 
         
            md:px-6 
            tablet:py-[40px]
            
          `,
          )}
        >
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
}
