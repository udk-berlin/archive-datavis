import getConfig from "next/config";
import { useImmer } from "use-immer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import HeaderNav from "./partials/HeaderNav";
import Footer from "./partials/Footer";

import {useIsMobile} from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const Layout = ({ children }) => {
  const router = useRouter();
  const currentUrl = router.asPath;

  const [mainHeight, setMainHeight] = useState(0);

  useEffect(() => {
    const calculateMainHeight = () => {
      const headerHeight = document.querySelector("header")?.offsetHeight || 0;
      const footerHeight = document.querySelector("footer")?.offsetHeight || 0;
      const viewportHeight = window.innerHeight;

      const availableHeight = viewportHeight - headerHeight - footerHeight;
      setMainHeight( window.innerWidth > 1023 ? availableHeight : 0);
    };

    // Calculate height on mount
    calculateMainHeight();

    // Recalculate height on window resize
    window.addEventListener("resize", calculateMainHeight);

    return () => {

      // Cleanup event listener on unmount
      window.removeEventListener("resize", calculateMainHeight);
    };

  }, []);

  return (
    <>
      <SidebarProvider defaultOpen={false}
        style={{
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        }}
      >
        <div className="flex flex-col lg:h-screen mx-auto max-w-full overflow-x-hidden">
          <HeaderNav />

          <main className="lg:flex-grow overflow-x-hidden" style={{ height: mainHeight > 0  ? `${mainHeight}px` : "auto" }}>
            {children}
          </main>
         
          <Footer className="lg:mt-auto" />
        </div>

        <Sidebar side="right">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Digitale Klasse Archive</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/archive">Archive</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/perspectives">Perspectives</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/library">Library</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/contribute">Contribute</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/about">About</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </>
  );
};

export default Layout;
