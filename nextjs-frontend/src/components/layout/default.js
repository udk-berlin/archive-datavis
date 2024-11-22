import getConfig from "next/config";
import { useImmer } from "use-immer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import HeaderNav from "./partials/HeaderNav";
import Footer from "./partials/Footer";

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
      setMainHeight(availableHeight);
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
    <div className="flex flex-col h-screen mx-auto">

        <HeaderNav />

      <main
        className="flex-grow overflow-x-hidden"
        style={{ height: mainHeight > 0 ? `${mainHeight}px` : "auto" }}
      >
        {children}
      </main>
      <footer>
        <Footer className="" />
      </footer>
    </div>
  );
};

export default Layout;
