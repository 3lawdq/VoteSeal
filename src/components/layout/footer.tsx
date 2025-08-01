
'use client'; // Keep this if using hooks like useTranslations, useLocale

import { Link } from '@/navigation'; // Use localized Link
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react'; // Import useEffect and useState

export default function Footer() {
  const t = useTranslations('Footer'); // Namespace for footer specific translations
  const locale = useLocale();
  const [currentYear, setCurrentYear] = useState<number | null>(null); // Initialize as null

  // Set the year only after the component has mounted on the client
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto border-t bg-background/80 backdrop-blur-sm" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-6 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        {/* Render year only when available client-side */}
        <p>
           &copy; {currentYear ?? ''} {t('appName')} {t('rightsReserved')}
        </p>
        {/* Example links - Add actual links if needed */}
        {/*
        <nav className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-foreground transition-colors">{t('privacyPolicy')}</Link>
          <Link href="/terms-of-service" className="hover:text-foreground transition-colors">{t('termsOfService')}</Link>
        </nav>
        */}
      </div>
    </footer>
  );
}
