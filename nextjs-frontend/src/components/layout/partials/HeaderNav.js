import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiLogoutBoxRLine, RiSearchLine, RiMenuFill } from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { useState, useEffect } from "react";


import { useSidebar } from "@/components/ui/sidebar";


const HeaderNav = ({openSidebar, sidebarOpened}) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { t } = useTranslation("header");
  const { i18n } = useTranslation();

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);


  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar()

  useEffect(() => {
    if(!isMobile) setOpen(false)
  }, [isMobile, setOpen])



  return (
    <header className="bg-white flex items-center justify-between px-12 h-12 max-w-full overflow-x-hidden">
      <h1 className="">
        <Link href="/">Digitale Klasse Archive</Link>
      </h1>
      <nav className="mx-auto pr-24 hidden xs:hidden md:hidden lg:block ">
        <ul className="flex space-x-24 items-center">
          <li>
            <Link href="/archive" className={currentPath === "/archive" ? "!underline" : ""}>
              {t("Archive")}
            </Link>
          </li>
          <li>
            <Link href="/perspectives" className={currentPath === "/perspectives" ? "!underline" : ""}>
              {t("Perspectives")}
            </Link>
          </li>
          {/* <li>
            <Link href="/library" className={currentPath === "/library" ? "!underline" : ""}>
              {t("Library")}
            </Link>
          </li> */}
          {/* <li>
            <Link href="/contribute" className={currentPath === "/datanetwork" ? "!underline" : ""}>
              {t("Contribute")}
            </Link>
          </li> */}
          <li>
            <Link href="/about" className={currentPath === "/about" ? "!underline" : ""}>
              {t("About")}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center">
        {/* <Input placeholder={"Search"} className={`  mr-4 border-0 ${searchOpen ? 'border-b-2' : 'border-b-0'}  ${searchOpen ? 'opacity-100' : 'opacity-0'}`} />

        <RiSearchLine
          className="mr-6 w-7"
          onClick={() => {
            setSearchOpen(!searchOpen);
          }}
        />
         */}

        {/* <RiLogoutBoxRLine className="mr-4 w-5" /> */}

        <Button
          variant="ghost"
          className="hover:bg-transparent hover:text-[rgb(0,0,255)] text-right pr-0 hidden  xs:hidden md:hidden lg:block"
          onClick={() => {
            if (i18n.language === "de") {
              i18n.changeLanguage("en");
            } else if (i18n.language === "en") {
              i18n.changeLanguage("de");
            }
          }}
        >
          {i18n.language === "de" ? "EN" : "DE"}
        </Button>
      </div>


      <Button className="lg:hidden pr-0" variant="ghost" onClick={() => {setOpenMobile(true)}}>
        <RiMenuFill className="w-7" />
      </Button>
     
    </header>
  );
};

export default HeaderNav;
