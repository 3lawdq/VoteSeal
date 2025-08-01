
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { pathnames } from './navigation'; // Use navigation config
import { locales, defaultLocale } from './i18n'; // Import locales and defaultLocale

// Placeholder cookie name used in AuthContext
const AUTH_COOKIE_NAME = 'web3auth_session';

// 1. next-intl middleware for handling locales and redirects
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: defaultLocale,

  // Use locale prefixing (e.g., /en/about, /ar/about)
  localePrefix: 'as-needed', // Or 'always' or 'never'

  // The pathnames config for localized URLs
  pathnames: pathnames,
});


// 2. Authentication middleware
async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes (using base paths without locale prefix)
  const protectedRoutes = ['/home', '/vote', '/results']; // Added /results

  // Check if the current path (without locale) matches a protected route
  const locale = request.nextUrl.locale || defaultLocale;
  const pathWithoutLocale = pathname.startsWith(`/${locale}`)
                            ? pathname.substring(locale.length + 1) || '/'
                            : pathname;

  const isProtectedRoute = protectedRoutes.some(route => pathWithoutLocale.startsWith(route));

   // Check for the authentication cookie
   const isAuthenticated = request.cookies.has(AUTH_COOKIE_NAME);
   console.log(`AuthMiddleware: Path: ${pathname}, Path w/o Locale: ${pathWithoutLocale}, IsProtected: ${isProtectedRoute}, IsAuthenticated: ${isAuthenticated}`);


  if (isProtectedRoute && !isAuthenticated) {
    // User is trying to access a protected route without being authenticated.
    // Redirect them to the landing page *with the current locale*.
    const redirectUrl = request.nextUrl.clone();
    // Use the base path '/' which should be defined in pathnames
    const landingPath = pathnames['/'][locale as keyof typeof pathnames['/']] || '/';
    redirectUrl.pathname = locale === defaultLocale ? landingPath : `/${locale}${landingPath}`;
    redirectUrl.search = ''; // Clear any query params
    console.log(`AuthMiddleware: Redirecting unauthenticated user from ${pathname} to ${redirectUrl.pathname}`);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated or not a protected route, allow request to proceed
   console.log(`AuthMiddleware: Allowing request for path: ${pathname}`);
  return NextResponse.next(); // Signal to proceed to the next middleware or handler
}


// 3. Main middleware function chaining intl and auth
export default async function middleware(request: NextRequest) {
   // First, run the next-intl middleware to handle locale detection and routing
   const intlResponse = await intlMiddleware(request);

   // If next-intl returned a response (e.g., redirect), return it immediately
   if (intlResponse) {
       console.log("Middleware: Intl middleware handled the request.");
       return intlResponse;
   }

   // If next-intl passed through (returned undefined or NextResponse.next()),
   // then run the authentication middleware
   console.log("Middleware: Intl middleware passed through, running auth middleware.");
   return authMiddleware(request);
}


// --- Matcher Configuration ---
export const config = {
  // Match only internationalized pathnames
  // Skip paths like /api, /_next, static assets, etc.
   matcher: [
      // Enable a redirect to a matching locale at the root
     '/',

      // Set a cookie to remember the previous locale for
     // all requests that have a locale prefix
     '/(ar|en)/:path*', // Match locale-prefixed paths

      // Enable redirects that add missing locales
     // (e.g. `/pathnames` -> `/en/pathnames`)
     '/((?!_next|api|.*\\..*).*)' // Match all paths except _next, api, and files with extensions
    ]
};

