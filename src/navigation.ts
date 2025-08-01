
import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation';
import { locales, defaultLocale } from './i18n'; // Import locales and defaultLocale

// Define pathnames for each locale
// Add more specific paths if needed, like '/vote/[id]'
export const pathnames = {
  // If all paths are the same, like in this example, you can
  // use the Automated Internationalization strategy instead.
  '/': '/',
  '/about': {
    en: '/about',
    ar: '/about' // Or use '/حول' if you prefer translated slugs
  },
  '/home': {
    en: '/home',
    ar: '/home' // Or '/الرئيسية'
  },
   '/results': {
     en: '/results',
     ar: '/results' // Or '/النتائج'
   },
   '/vote': {
     en: '/vote',
     ar: '/vote' // Or '/تصويت'
   }
} satisfies Pathnames<typeof locales>;


export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales, pathnames});

// The `localePrefix` strategy is selected automatically based on
// the presence of defined pathnames. You can override this behavior
// by returning `always` or `never`. Documentation: https://next-intl.tdz.fyi/docs/routing/navigation#locale-prefix
// export const localePrefix = undefined;
