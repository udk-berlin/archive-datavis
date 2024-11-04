import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className=" bg-secondary py-8 flex justify-between px-12  ">
      <section className=" text-muted ">
        <ul className="flex space-x-12">
          <li>
            <Link className="!text-popover font-normal" href="/imprint">Contact</Link>
          </li>
          <li>
            <Link className="!text-popover font-normal" href="/privacy">Imprint</Link>
          </li>
          <li>
            <Link className="!text-popover font-normal" href="/contact">Report Content</Link>
          </li>
          <li>
            <Link className="!text-popover font-normal" href="/abuse">Privacy</Link>
          </li>
        </ul>
      </section>
      <section className="max-w-xl text-secondary-forground mb-4">
        <p className="!text-secondary-foreground">
          The Digitale Klasse Archive was created in the context of the "labor for digital infastructure" with generous support by inküle. <br/>🄯
          1990–2023 Digitale Klasse / UdK Berlin
        </p>
      </section>
    </footer>
  );
};

export default Footer;
