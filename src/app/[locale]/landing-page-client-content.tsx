
'use client';

import dynamic from 'next/dynamic';
import { Link } from '@/navigation'; // Use localized Link
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import Web3AuthButton with a loading skeleton *inside* the client component
const Web3AuthButton = dynamic(() => import('@/components/auth/web3-auth-button'), {
  ssr: false, // Disable SSR for this client-side component
  loading: () => <Skeleton className="h-10 w-full rounded-md" />, // Show skeleton while loading
});

export default function LandingPageClientContent() {
    const t = useTranslations('LandingPage'); // Load translations here

    return (
         <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-t from-accent/20 to-background"> {/* Adjusted padding and gradient */}
            <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6"> {/* Adjusted gap */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    {t('ctaTitle')}
                    </h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground text-lg md:text-xl xl:text-xl/relaxed"> {/* Responsive text size */}
                    {t('ctaDescription')}
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-3"> {/* Adjusted spacing */}
                    <Web3AuthButton /> {/* Use the dynamically imported button */}
                </div>
                <div className="flex justify-center gap-4 mt-6"> {/* Adjusted margin */}
                        <Link href="/about">
                        <Button variant="link" className="gap-1 text-primary hover:text-primary/80 text-base"> {/* Increased text size */}
                            <InfoIcon className="h-4 w-4" />
                            {t('learnMore')}
                        </Button>
                        </Link>
                </div>
            </div>
        </section>
    );
}
