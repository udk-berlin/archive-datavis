import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/router";

const HeaderNav = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <header className="flex items-center space-x-4">
      <h1 className="mr-10">
        <Link href="/">digitaleklasse</Link>
      </h1>
      <nav className="flex-grow ml-10">
        <ul className="flex space-x-12">
          <li>
            <Link href="/archive" className={currentPath === "/archive" ? "!underline" : ""}>archive</Link>
          </li>
          <li>
            <Link href="/datanetwork" className={currentPath === "/datanetwork" ? "!underline" : ""}>data network</Link>
          </li>
          <li>
            <Link href="/perspectives" className={currentPath === "/perspectives" ? "!underline" : ""}>perspectives</Link>
          </li>
          <li>
            <Link href="/about" className={currentPath === "/about" ? "!underline" : ""}>about</Link>
          </li>
        </ul>
      </nav>
      <Select className="ml-auto">
        <SelectTrigger className="w-auto border-none m-0 p-0">
          <SelectValue placeholder="en" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">en</SelectItem>
          <SelectItem value="de">de</SelectItem>
        </SelectContent>
      </Select>
    </header>
  );
};

export default HeaderNav;