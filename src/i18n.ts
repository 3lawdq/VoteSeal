
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Can be imported from a shared config
export const locales = ['en', 'ar'];
export const defaultLocale = 'en';

// Ensure locales are valid before proceeding
if (!locales.includes(defaultLocale)) {
  throw new Error(`Default locale "${defaultLocale}" is not included in the available locales: ${locales.join(', ')}`);
}

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
   let finalLocale = locale;
   if (!locales.includes(locale as any)) {
      console.warn(`Invalid locale "${locale}" requested. Falling back to default "${defaultLocale}".`);
      // Optionally redirect to default locale or show notFound,
      // For now, we load default locale messages to avoid crashing.
      // A middleware redirect might be better UX.
      finalLocale = defaultLocale;
   }

  // Load messages for the validated locale
  let messages;
  try {
    messages = (await import(`../messages/${finalLocale}.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale "${finalLocale}":`, error);
    // Fallback strategy: load default locale messages if the requested one fails
    if (finalLocale !== defaultLocale) {
      console.warn(`Falling back to default locale "${defaultLocale}" messages.`);
      try {
        messages = (await import(`../messages/${defaultLocale}.json`)).default;
         finalLocale = defaultLocale; // Ensure finalLocale is updated on fallback
      } catch (fallbackError) {
        console.error(`Could not load messages for default locale "${defaultLocale}":`, fallbackError);
        // If default messages also fail, something is seriously wrong.
        notFound(); // Or throw a more specific error
      }
    } else {
      // If loading default locale failed initially
      notFound();
    }
  }

  return {
    locale: finalLocale, // Return the validated locale
    messages
  };
});
