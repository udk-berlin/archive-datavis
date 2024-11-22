import Link from "next/link";

import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("footer");
  return (
    <footer className="bg-white h-12 flex justify-between items-center px-12">
    <section>
      <ul className="flex space-x-12">
        <li>
          <Link className="font-normal text-xs" href="/imprint">{t('Contact')}</Link>
        </li>
        <li>
          <Link className="font-normal text-xs" href="/privacy">{t('Imprint + Privacy')}</Link>
        </li>
      </ul>
    </section>
  </footer>
  
  );
};

export default Footer;
