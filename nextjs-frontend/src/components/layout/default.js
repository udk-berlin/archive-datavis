import getConfig from "next/config";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from 'next/link'

const Layout = ({ children }) => {
  const router = useRouter();
  const currentUrl = router.asPath;

  return (
    <div className="mx-auto px-5">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold"><Link href="/">digitaleklasse</Link></h1>
      </header>
      <main className="flex-grow overflow-x-hidden">{children}</main>
    </div>
  );
};

export default Layout;