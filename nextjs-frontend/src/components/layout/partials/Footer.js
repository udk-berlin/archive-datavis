import Link from "next/link";

import { useTranslation } from "react-i18next";

import { RiQuestionLine } from "@remixicon/react";

const Footer = () => {
  const { t } = useTranslation("footer");
  return (
    <footer className="bg-white h-12 flex justify-between items-center px-12">
      <section>
        <ul className="flex space-x-12">
          <li>
            <Link className="font-normal text-xs" href="/imprint">
              {t("Contact")}
            </Link>
          </li>
          <li>
            <Link className="font-normal text-xs" href="/privacy">
              {t("Imprint + Privacy")}
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <div className="flex flex-cols  items-center">
          <Link className="font-normal text-xs" href="/imprint">
            Report Content
          </Link>
          <RiQuestionLine className="ml-2 w-4" />
        </div>
      </section>
    </footer>
  );
};

export default Footer;
