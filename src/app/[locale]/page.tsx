
import { Link } from '@/navigation'; // Use localized Link
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRightIcon, BarChartIcon, CheckSquareIcon, InfoIcon, LockIcon, UsersIcon, SquareCheckBig } from 'lucide-react'; // Added SquareCheckBig
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl'; // Import useLocale
import { getTranslations } from 'next-intl/server'; // For metadata
import LandingPageClientContent from './landing-page-client-content'; // Import the new client component

// Generate metadata dynamically based on locale (Server Component logic)
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

// This is the Landing Page for the application (Server Component)
export default function LandingPage() {
  const t = useTranslations('LandingPage'); // Load translations for 'LandingPage' namespace
  const locale = useLocale(); // Get the current locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="flex flex-col items-center justify-center space-y-16 md:space-y-24 lg:space-y-28" dir={dir}> {/* Consistent spacing */}
      {/* Hero Section */}
      <section className="w-full py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-background via-accent/10 to-background"> {/* Adjusted padding */}
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_550px] lg:gap-12 xl:gap-16 items-center"> {/* Responsive grid, adjusted column size */}
             <div className="flex flex-col justify-center space-y-6 text-center lg:text-left lg:order-first"> {/* Text alignment, order */}
              <div className="space-y-4">
                 <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground/90 to-primary"> {/* Adjusted gradient, line height */}
                  {t('heroTitle')}
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl xl:text-xl/relaxed mx-auto lg:mx-0"> {/* Responsive text size, margin */}
                  {t('heroDescription')}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row justify-center lg:justify-start"> {/* Adjusted gap, alignment */}
                {/* Link to Vote page */}
                <Link href="/vote">
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-md hover:shadow-lg transition-shadow duration-200"> {/* Added shadow */}
                     <SquareCheckBig className="h-5 w-5" /> {/* Use SquareCheckBig */}
                    {t('castVote')}
                    <ArrowRightIcon className="ml-1 h-5 w-5 rtl:mr-1 rtl:ml-0" /> {/* Handle RTL direction */}
                  </Button>
                </Link>
                 {/* Link to Results page */}
                 <Link href="/results">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-border hover:bg-accent hover:border-primary/30 transition-colors duration-200"> {/* Enhanced hover */}
                    <BarChartIcon className="h-5 w-5" />
                    {t('viewResults')}
                  </Button>
                </Link>
              </div>
            </div>
             <Image
              src="https://picsum.photos/650/450" // Image size can be adjusted
              alt={t('heroTitle')} // Use translated alt text
              width={650}
              height={450}
              className="mx-auto aspect-video lg:aspect-[4/3] overflow-hidden rounded-xl object-cover w-full shadow-lg border border-border/20" // Responsive aspect ratio and width
              data-ai-hint="blockchain voting security illustration"
              priority // Prioritize loading the hero image
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-20 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-5 text-center mb-14 md:mb-20"> {/* Centered heading, spacing */}
            <div className="inline-block rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground mb-3">{t('keyFeatures')}</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t('whyChoose')}
            </h2>
            <p className="max-w-[900px] text-muted-foreground text-lg md:text-xl xl:text-xl/relaxed"> {/* Responsive text size */}
              {t('featuresDescription')}
            </p>
          </div>
          {/* Adjusted grid for better responsiveness */}
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-3 lg:gap-12">
            {/* Feature: Security */}
             <Card className="shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20 hover:-translate-y-1 overflow-hidden group flex flex-col h-full"> {/* Added h-full */}
              <CardHeader className="bg-card p-6 pb-4 items-center"> {/* Center items in header */}
                 <div className="mb-4 flex justify-center items-center h-14 w-14 rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300"> {/* Adjusted margin */}
                   <LockIcon className="h-7 w-7" />
                 </div>
                <CardTitle className="text-xl font-semibold text-center"> {/* Centered */}
                  {t('securityTitle')}
                </CardTitle>
              </CardHeader>
               <CardContent className="p-6 pt-2 flex-grow"> {/* Adjusted padding, Added flex-grow */}
                <CardDescription className="text-center text-base"> {/* Adjusted text size */}
                  {t('securityDescription')}
                </CardDescription>
              </CardContent>
            </Card>
             {/* Feature: Transparency */}
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20 hover:-translate-y-1 overflow-hidden group flex flex-col h-full"> {/* Added h-full */}
              <CardHeader className="bg-card p-6 pb-4 items-center">
                 <div className="mb-4 flex justify-center items-center h-14 w-14 rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300">
                  <UsersIcon className="h-7 w-7" />
                 </div>
                <CardTitle className="text-xl font-semibold text-center"> {/* Centered */}
                  {t('transparencyTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2 flex-grow">
                <CardDescription className="text-center text-base">
                   {t('transparencyDescription')}
                </CardDescription>
              </CardContent>
            </Card>
            {/* Feature: Accessibility */}
             <Card className="shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20 hover:-translate-y-1 overflow-hidden group flex flex-col h-full"> {/* Added h-full */}
              <CardHeader className="bg-card p-6 pb-4 items-center">
                 <div className="mb-4 flex justify-center items-center h-14 w-14 rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300">
                   <SquareCheckBig className="h-7 w-7" /> {/* Use SquareCheckBig */}
                 </div>
                <CardTitle className="text-xl font-semibold text-center"> {/* Centered */}
                  {t('accessibilityTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2 flex-grow">
                 <CardDescription className="text-center text-base">
                   {t('accessibilityDescription')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <LandingPageClientContent /> {/* Use the client component here */}

    </div>
  );
}
