import Link from "next/link";

import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('footer'); 
  return (
    <footer className=" bg-secondary py-4 flex justify-between px-12  ">
      <section className=" ">
        <ul className="flex space-x-12">
          <li>
            <Link className="!text-popover font-normal text-xs" href="/imprint">{t('Contact')}</Link>
          </li>
          <li>
            <Link className="!text-popover font-normal text-xs" href="/privacy">{t('Imprint + Privacy')}</Link>
          </li>
        </ul>
      </section>
      
    </footer>
  );
};

export default Footer;
