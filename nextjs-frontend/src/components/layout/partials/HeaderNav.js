import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiLogoutBoxRLine, RiSearchLine } from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from 'react-i18next';


const HeaderNav = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { t } = useTranslation('header'); 
  const { i18n } = useTranslation();

  return (
    <header className="flex px-12">
      <h1 className="mr-10">
        <Link href="/">Digitale Klasse Archive</Link>
      </h1>
      <nav className="flex-grow ml-36">
        <ul className="flex space-x-24">
          <li>
            <Link href="/archive" className={currentPath === "/archive" ? "!underline" : ""}>{t('Archive')}</Link>
          </li>
          <li>
            <Link href="/perspectives" className={currentPath === "/perspectives" ? "!underline" : ""}>{t('Perspectives')}</Link>
          </li>
          <li>
            <Link href="/contribute" className={currentPath === "/datanetwork" ? "!underline" : ""}>{t('Contribute')}</Link>
          </li>
          <li>
            <Link href="/about" className={currentPath === "/about" ? "!underline" : ""}>{t('About')}</Link>
          </li>
        </ul>
      </nav>
      <div className="flex">
        <RiLogoutBoxRLine className="mr-6 w-5" />
        <RiSearchLine className="mr-6 w-5" />
      <Select className="ml-auto"  onValueChange={(e) => {
                  i18n.changeLanguage(e);
                }}>
        <SelectTrigger className="w-auto border-none m-0 p-0 text-md pb-4" icon={false}>
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