import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiLogoutBoxRLine, RiSearchLine } from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";

import { useState } from "react";

const HeaderNav = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { t } = useTranslation("header");
  const { i18n } = useTranslation();

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="flex items-center px-12">
      <h1 className="mr-10">
        <Link href="/">Digitale Klasse Archive</Link>
      </h1>
      <nav className="flex-grow ml-36 flex">
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
          <li>
            <Link href="/library" className={currentPath === "/library" ? "!underline" : ""}>
              {t("Library")}
            </Link>
          </li>
          <li>
            <Link href="/contribute" className={currentPath === "/datanetwork" ? "!underline" : ""}>
              {t("Contribute")}
            </Link>
          </li>
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

<RiLogoutBoxRLine className="mr-6 w-7" />

        <Select
          className="ml-auto"
          onValueChange={(e) => {
            i18n.changeLanguage(e);
          }}
        >
          <SelectTrigger className="w-auto border-none m-0 p-0 text-md" icon={false}>
            <SelectValue placeholder={i18n.language} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">en</SelectItem>
            <SelectItem value="de">de</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default HeaderNav;
