
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/navigation'; // Use localized navigation hooks
import { locales } from '@/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button'; // Import Button for potential trigger styling
import { GlobeIcon } from 'lucide-react'; // Use a suitable icon

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher'); // Translations for this component
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (newLocale: string) => {
    // Check if the new locale is valid and different from the current one
    if (locales.includes(newLocale) && newLocale !== locale) {
       // Replace the current locale in the pathname with the new one
       // This maintains the current page but changes the language
       router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <Select onValueChange={onSelectChange} defaultValue={locale}>
      <SelectTrigger
        className="w-auto h-9 px-2 sm:px-3 border-border/60 hover:border-primary/30 focus:ring-primary/30 focus:ring-offset-0 focus:ring-1 shrink-0" // Added shrink-0, reduced horizontal padding
        aria-label={t('label')} // Add ARIA label for accessibility
      >
        <div className="flex items-center gap-1.5">
          <GlobeIcon className="h-4 w-4 text-muted-foreground" />
           {/* Hide text label on smaller screens, show on sm and up */}
           <span className="hidden sm:inline">
             <SelectValue placeholder={t('label')} />
           </span>
           {/* Hide locale code on small screens as well for pure icon button */}
           {/*
           <span className="sm:hidden text-xs font-medium uppercase">
                {locale}
           </span>
           */}
        </div>
      </SelectTrigger>
      <SelectContent align="end"> {/* Align dropdown to the end */}
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
             {/* Display language name (consider adding full names like "English", "العربية") */}
            {t(loc as 'en' | 'ar')} {/* Translate locale code */}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

    
