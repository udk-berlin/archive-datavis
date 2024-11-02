import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="flex text-gray-500 space-x-24 ">
      <section className="max-w-xs">
        <p>the digitaleklasse took place between 1990-2023 at the berlin university of the arts. initated by joachimn sauter.</p>
      </section>
      <Separator orientation="vertical" />
      <section className="max-w-xs">
        <p>the digitaleklasse archive was created in the context of the "labor for digital infastructure" and supported by inküle.</p>
      </section>
      <section className="max-w-xs">
        <ul>
          <li>
            <Link href="/imprint">imprint</Link>
          </li>
          <li>
            <Link href="/privacy">privacy</Link>
          </li>
          <li>
            <Link href="/contact">contact</Link>
          </li>
          <li>
            <Link href="/abuse">Report content</Link>
          </li>
        </ul>
      </section>
    </footer>
  );
};

export default Footer;