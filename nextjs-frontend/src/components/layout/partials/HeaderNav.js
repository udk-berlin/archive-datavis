import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiLogoutBoxRLine, RiSearchLine } from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/router";

const HeaderNav = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <header className="flex px-12">
      <h1 className="mr-10">
        <Link href="/">Digitale Klasse Archive</Link>
      </h1>
      <nav className="flex-grow ml-36">
        <ul className="flex space-x-24">
          <li>
            <Link href="/archive" className={currentPath === "/archive" ? "!underline" : ""}>Archive</Link>
          </li>
          <li>
            <Link href="/perspectives" className={currentPath === "/perspectives" ? "!underline" : ""}>Perspectives</Link>
          </li>
          <li>
            <Link href="/contribute" className={currentPath === "/datanetwork" ? "!underline" : ""}>Contribute</Link>
          </li>
          <li>
            <Link href="/about" className={currentPath === "/about" ? "!underline" : ""}>About</Link>
          </li>
        </ul>
      </nav>
      <div className="flex">
        <RiLogoutBoxRLine className="mr-4" />
        <RiSearchLine className="mr-4" />
      <Select className="ml-auto">
        <SelectTrigger className="w-auto border-none m-0 p-0">
          <SelectValue placeholder="en" />
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