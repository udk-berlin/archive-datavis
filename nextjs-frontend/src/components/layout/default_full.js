import getConfig from "next/config";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from 'next/link'

import HeaderNav from "./partials/HeaderNav";
import Footer from "./partials/Footer";

const Layout = ({ children }) => {
  const router = useRouter();
  const currentUrl = router.asPath;

  return (
    <div className="flex flex-col min-h-screen mx-auto  mt-6">
      <HeaderNav />
      <main className="flex-grow overflow-x-hidden mt-12 px-0 pb-24">{children}</main>
      <Footer className="" />
    </div>
  );
};

export default Layout;