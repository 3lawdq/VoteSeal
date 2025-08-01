import { getTranslations } from 'next-intl/server'; // Keep this import if used server-side in the future
import { useTranslations as useClientTranslations } from 'next-intl'; // Use client hook for client components

/**
 * Formats a Unix timestamp (seconds) into a localized date and time string.
 * Handles potential errors and returns a fallback string ('N/A') if formatting fails
 * or if executed on the server without necessary context (though primarily designed for client-side).
 *
 * @param timestamp The Unix timestamp in seconds.
 * @param locale The current locale string (e.g., 'en', 'ar').
 * @param t A translation function instance (e.g., from useTranslations) for the 'na' fallback.
 * @returns A localized string representation of the date and time, or 'N/A'.
 */
export function formatTimestamp(
  timestamp: number | null | undefined,
  locale: string,
  t: (key: string) => string // Expecting the translation function directly
): string {
   // Basic checks for invalid input
   if (timestamp === null || timestamp === undefined || isNaN(timestamp) || timestamp === 0) {
     return t('na'); // Use the passed translation function
   }

   try {
     // Multiply by 1000 for milliseconds
     const date = new Date(timestamp * 1000);

     // Check if the date is valid after creation
     if (isNaN(date.getTime())) {
       console.warn(`formatTimestamp: Invalid date created from timestamp: ${timestamp}`);
       return t('na');
     }

     // Format the date using Intl.DateTimeFormat for better localization control
     const formattedDate = new Intl.DateTimeFormat(locale, {
       dateStyle: 'medium', // e.g., "May 7, 2024" or "٧ مايو ٢٠٢٤"
       timeStyle: 'short', // e.g., "10:30 AM" or "١٠:٣٠ ص"
       // timeZone: 'UTC', // Optional: Specify timezone if needed, otherwise uses client's default
     }).format(date);

     return formattedDate;
   } catch (e) {
     console.error("Error formatting timestamp:", e, "Timestamp:", timestamp, "Locale:", locale);
     return t('na'); // Fallback on any formatting error
   }
}
