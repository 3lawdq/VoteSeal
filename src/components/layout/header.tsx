 "use client";

import { Link } from '@/navigation'; // Use localized Link from navigation.ts
import { BarChartIcon, HomeIcon, InfoIcon, MenuIcon, XIcon, SquareCheckBig } from 'lucide-react'; // Adjusted icons
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Web3AuthButton from '@/components/auth/web3-auth-button';
import { useAuth } from '@/context/auth-context';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './language-switcher';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const { user, isLoading: isAuthLoading } = useAuth(); // Renamed isLoading for clarity
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // State for client mount

  useEffect(() => {
    setIsClient(true); // Set to true once mounted on the client
  }, []);

  // Memoize navLinks to prevent re-creation on every render unless dependencies change
  const navLinks = useMemo(() => (
    <>
      {/* Render Home link only after client mount and if user is authenticated */}
       {isClient && !isAuthLoading && user && (
         <Link
          href="/home"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary px-1 py-1 rounded-md',
            'text-foreground/80 hover:bg-accent flex items-center gap-1.5'
          )}
          aria-label={t('dashboard')}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <HomeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{t('dashboard')}</span>
           <span className="sm:hidden">{t('dash')}</span>
        </Link>
      )}
      {/* Vote Link */}
      <Link
        href="/vote"
        className={cn(
          'text-sm font-medium transition-colors hover:text-primary px-1 py-1 rounded-md',
          'text-foreground/80 hover:bg-accent flex items-center gap-1.5'
        )}
        aria-label={t('vote')}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <SquareCheckBig className="h-4 w-4" /> {/* Changed icon */}
        <span>{t('vote')}</span>
      </Link>
       {/* Results Link */}
      <Link
        href="/results"
         className={cn(
          'text-sm font-medium transition-colors hover:text-primary px-1 py-1 rounded-md',
          'text-foreground/80 hover:bg-accent flex items-center gap-1.5'
        )}
        aria-label={t('results')}
        onClick={() => setIsMobileMenuOpen(false)}
      >
          <BarChartIcon className="h-4 w-4" />
          <span>{t('results')}</span>
      </Link>
       {/* About Link */}
      <Link
        href="/about"
         className={cn(
          'text-sm font-medium transition-colors hover:text-primary px-1 py-1 rounded-md',
          'text-foreground/80 hover:bg-accent flex items-center gap-1.5'
        )}
        aria-label={t('about')}
        onClick={() => setIsMobileMenuOpen(false)}
      >
          <InfoIcon className="h-4 w-4" />
          <span>{t('about')}</span>
      </Link>
    </>
  // Dependencies for memoization
  ), [isClient, isAuthLoading, user, t]);


  const MobileMenuTrigger = () => (
      <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={t('toggleSidebar')}>
                      <MenuIcon className="h-6 w-6" />
                  </Button>
              </SheetTrigger>
              <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-[250px] sm:w-[300px] p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b flex flex-row justify-between items-center">
                      <SheetTitle>{t('appName')}</SheetTitle> {/* Use appName */}
                      <SheetClose asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                              <XIcon className="h-4 w-4" />
                              <span className="sr-only">Close</span>
                          </Button>
                      </SheetClose>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto">
                      <nav className="flex flex-col space-y-2 p-4">
                          {navLinks}
                      </nav>
                  </div>
                  <div className="flex flex-col space-y-3 p-4 border-t mt-auto bg-background"> {/* Ensure background */}
                     {/* Render components directly, keep normal size */}
                     <LanguageSwitcher />
                     <Web3AuthButton />
                  </div>
              </SheetContent>
          </Sheet>
      </div>
  );

  const LogoLink = () => (
      <Link href="/" className={cn("flex items-center shrink-0", dir === 'rtl' ? 'ml-2' : 'mr-2')}> {/* Adjusted spacing */}
          {/* Simplified SVG or use an <img> tag for logo */}
           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z"/></svg>
          <span className="font-bold text-lg hidden sm:inline-block">
              {t('appName')}
          </span>
      </Link>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm" dir={dir}>
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 gap-2"> {/* Added gap */}

         {/* Left Group (Logo and Mobile Trigger) */}
         <div className="flex items-center gap-2">
            <MobileMenuTrigger /> {/* Always render trigger */}
            <LogoLink />
         </div>


        {/* Desktop Navigation Links (Centered) */}
        <nav className={cn(
            "hidden md:flex items-center gap-1 lg:gap-2 overflow-x-auto sm:overflow-visible mx-auto", // Centering and responsiveness
            dir === 'rtl' && 'space-x-reverse'
         )}>
           {navLinks}
        </nav>

        {/* Right Group (Language and Auth) - Always visible, adjust size */}
        <div className={cn("flex items-center gap-1 sm:gap-2 shrink-0")}> {/* Reduced gap */}
           <LanguageSwitcher />
            {/* Render Auth button or skeleton based on client mount */}
            {isClient ? (
                <Web3AuthButton />
            ) : (
                 <Skeleton className="h-9 w-[40px] sm:w-[190px] rounded-md" />
            )}
        </div>

      </div>
    </header>
  );
}
