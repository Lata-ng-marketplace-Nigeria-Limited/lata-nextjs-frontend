import React, { Suspense } from "react";
import { cn } from "@/utils";
import Header from "@/components/organism/Header";
import SideMenu from "@/components/organism/SideMenu";
import Footer from "@/components/organism/Footer";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { GetUser } from "@atom/GetUser";

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  return (
    <main className={"bg-white h-full"}>
      <Suspense>
        <GetUser />
      </Suspense>
      <Header recentSearches={[]} />
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
            px-1 
            xs:px-2.5 
            sm:px-4 
            md:px-6 
            py-[10px] 
            tablet:py-[40px]
            w-full 
            h-full
            mx-auto 
            max-w-[1202px] 
         
            min-h-[calc(100vh-50px-200px)] 
            md:min-h-[calc(100vh-60px-200px)]
            
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
