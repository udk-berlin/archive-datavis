import Link from "next/link";

import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('footer'); 
  return (
    <footer className=" bg-secondary py-8 flex justify-between px-12  ">
      <section className=" text-muted ">
        <ul className="flex space-x-12">
          <li>
            <Link className="!text-popover font-normal" href="/imprint">{t('Contact')}</Link>
          </li>
          <li>
            <Link className="!text-popover font-normal" href="/privacy">{t('Imprint')}</Link>
          </li>
          <li>
            <Link className="!text-popover font-normal" href="/contact">{t('Report Content')}</Link>
          </li>
          <li>
            <Link className="!text-popover font-normal" href="/abuse">{t('Privacy')}</Link>
          </li>
        </ul>
      </section>
      <section className="max-w-xl text-secondary-forground mb-4">
        <p className="!text-secondary-foreground">
          {t('The Digitale Klasse Archive was created in the context of the \"labor for digital infastructure\" with generous support by inküle.')}
          <br/>
          {t('🄯 1990–2023 Digitale Klasse / UdK Berlin')}
        </p>
      </section>
    </footer>
  );
};

export default Footer;
