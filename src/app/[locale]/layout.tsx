import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { locales } from '@/i18n';
import { ReactNode, Suspense } from 'react';
import LoadingFallback from './loading-fallback';
import ClientOnlyWrapper from '@/components/layout/client-only-wrapper';

// ✅ Initialize Google Font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// ✅ Metadata (Next.js 15+ syntax fix)
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  return {
    title: "VoteChain - Secure E-Voting",
    description: "Secure and transparent e-voting application.",
    icons: {
      icon: '/favicon.ico',
    },
  };
}

// ✅ Static Params for Supported Locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// ✅ Root Layout
export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={inter.className}>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <ClientOnlyWrapper>
                <Header />
              </ClientOnlyWrapper>

              <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 sm:py-10 md:py-12">
                <Suspense fallback={<LoadingFallback />}>
                  {children}
                </Suspense>
              </main>

              <ClientOnlyWrapper>
                <Footer />
              </ClientOnlyWrapper>
            </div>
            <Toaster />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
