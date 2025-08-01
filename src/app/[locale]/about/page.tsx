
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/navigation'; // Use localized Link
import { InfoIcon, ShieldCheckIcon, EyeIcon, UsersIcon, ListChecksIcon } from 'lucide-react'; // Removed unused icons
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl'; // Import useLocale
import { getTranslations } from 'next-intl/server'; // For metadata

// Generate metadata dynamically based on locale
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('title'), // Use generic title or specific one for about
    description: t('description'),
  };
}

export default function AboutPage() {
  const t = useTranslations('AboutPage'); // Load translations for 'AboutPage'
  const tVote = useTranslations('VotePage'); // Load translations for vote page steps
  const locale = useLocale(); // Get the current locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20 pb-12" dir={dir}> {/* Responsive spacing */}
      {/* Page Header */}
      <section className="text-center pt-8 pb-12 md:pt-12 md:pb-16 bg-gradient-to-b from-background to-accent/30 rounded-lg shadow-sm">
         {/* Responsive text size */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight lg:text-5xl mb-3 sm:mb-4 text-primary">
          {t('title')}
        </h1>
         {/* Responsive text size and padding */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          {t('description')}
        </p>
      </section>

      {/* What is VoteChain? */}
      <section>
        <Card className="shadow-md overflow-hidden">
          {/* Responsive grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2">
             {/* Text Content */}
             <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col justify-center order-last md:order-first"> {/* Order control, responsive padding */}
               {/* Responsive heading size */}
              <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                <InfoIcon className="h-6 w-6 sm:h-7 sm:w-7" /> {/* Responsive icon size */}
                {t('whatIsVoteChainTitle')}
              </h2>
               {/* Responsive text size */}
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {t('whatIsVoteChainP1')}
              </p>
               {/* Responsive text size */}
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('whatIsVoteChainP2')}
              </p>
            </CardContent>
            {/* Image */}
             <div className="relative h-48 sm:h-64 md:h-auto min-h-[250px] md:min-h-full"> {/* Ensure minimum height, responsive initial height */}
                <Image
                    src="https://picsum.photos/600/400?random=1"
                    alt={t('whatIsVoteChainTitle')} // Translated alt text
                    layout="fill" // Use fill layout
                    objectFit="cover" // Ensure image covers the area
                    className=""
                    data-ai-hint="digital voting blockchain concept illustration"
                 />
            </div>
          </div>
        </Card>
      </section>

      {/* Core Principles */}
      <section className="space-y-8">
         {/* Responsive heading size and margin */}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground mb-8 sm:mb-10 md:mb-12">
          {t('corePrinciplesTitle')}
        </h2>
        {/* Responsive grid for principles */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 lg:gap-10 sm:grid-cols-1 md:grid-cols-3">
          {/* Security Card */}
           {/* Added flex-col, responsive padding */}
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary flex flex-col p-4 sm:p-6">
            <CardHeader className="items-center p-0 pb-3 sm:pb-4"> {/* Center header items, adjust padding */}
              {/* Responsive icon size */}
              <div className="mx-auto bg-primary/10 rounded-full p-2 sm:p-3 w-fit mb-2 sm:mb-3">
                 <ShieldCheckIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">{t('securityTitle')}</CardTitle> {/* Responsive size */}
              <CardDescription className="text-xs sm:text-sm">{t('securitySubtitle')}</CardDescription> {/* Responsive size */}
            </CardHeader>
            <CardContent className="flex-grow p-0"> {/* Allow content to grow, adjust padding */}
              <p className="text-sm sm:text-base text-muted-foreground"> {/* Responsive size */}
                {t('securityDescription')}
              </p>
            </CardContent>
          </Card>

          {/* Transparency Card */}
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary flex flex-col p-4 sm:p-6">
             <CardHeader className="items-center p-0 pb-3 sm:pb-4">
               <div className="mx-auto bg-primary/10 rounded-full p-2 sm:p-3 w-fit mb-2 sm:mb-3">
                <EyeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">{t('transparencyTitle')}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t('transparencySubtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('transparencyDescription')}
              </p>
            </CardContent>
          </Card>

          {/* Accessibility Card */}
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary flex flex-col p-4 sm:p-6">
             <CardHeader className="items-center p-0 pb-3 sm:pb-4">
               <div className="mx-auto bg-primary/10 rounded-full p-2 sm:p-3 w-fit mb-2 sm:mb-3">
                <UsersIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">{t('accessibilityTitle')}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t('accessibilitySubtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('accessibilityDescription')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Vote Section */}
      <section id="voting-process" className="scroll-mt-20"> {/* Added ID and scroll margin */}
        <Card className="shadow-md">
           {/* Responsive padding */}
          <CardHeader className="p-4 sm:p-6">
            {/* Responsive title size and gap */}
            <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                <ListChecksIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /> {/* Responsive icon size */}
                {tVote('howToVote')} {/* Reusing translation key */}
            </CardTitle>
             {/* Responsive description size */}
            <CardDescription className="text-sm sm:text-base">{t('howToVoteDescription')}</CardDescription>
          </CardHeader>
           {/* Responsive padding and spacing */}
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Responsive gap and icon size */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base sm:text-lg mt-1">1</div>
              <div>
                 {/* Responsive heading and text size */}
                <h3 className="font-semibold text-base sm:text-lg mb-1">{t('howToVoteStep1Title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t('howToVoteStep1Desc')}</p>
              </div>
            </div>
             <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base sm:text-lg mt-1">2</div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">{t('howToVoteStep2Title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t('howToVoteStep2Desc')}</p>
              </div>
            </div>
             <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base sm:text-lg mt-1">3</div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">{t('howToVoteStep3Title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t('howToVoteStep3Desc')}</p>
              </div>
            </div>
             <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base sm:text-lg mt-1">4</div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">{t('howToVoteStep4Title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t('howToVoteStep4Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base sm:text-lg mt-1">5</div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">{t('howToVoteStep5Title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t('howToVoteStep5Desc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>


       {/* Technology Stack */}
       <section>
         <Card className="shadow-md">
            {/* Responsive padding */}
           <CardHeader className="p-4 sm:p-6">
              {/* Responsive title/description size */}
             <CardTitle className="text-xl sm:text-2xl font-semibold">{t('techStackTitle')}</CardTitle>
             <CardDescription className="text-sm sm:text-base">{t('techStackDescription')}</CardDescription>
           </CardHeader>
            {/* Responsive padding and spacing */}
           <CardContent className="space-y-4 md:space-y-6 p-4 sm:p-6">
             {/* Responsive layout for tech items */}
             <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
               <div className="bg-primary text-primary-foreground rounded-full p-1.5 sm:p-2 flex-shrink-0 mt-1 sm:mt-0"> {/* Responsive padding */}
                 {/* Blockchain Icon Placeholder */}
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
               </div>
               <div>
                  {/* Responsive heading/text size */}
                 <h3 className="font-semibold text-base sm:text-lg">{t('blockchainTitle')}</h3>
                 <p className="text-xs sm:text-sm text-muted-foreground">{t('blockchainDescription')}</p>
               </div>
             </div>
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="bg-primary text-primary-foreground rounded-full p-1.5 sm:p-2 flex-shrink-0 mt-1 sm:mt-0">
                   {/* Web3Auth Icon Placeholder */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M12 15a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6Z"/></svg>
                </div>
               <div>
                 <h3 className="font-semibold text-base sm:text-lg">{t('web3AuthTitle')}</h3>
                 <p className="text-xs sm:text-sm text-muted-foreground">{t('web3AuthDescription')}</p>
               </div>
             </div>
             <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="bg-primary text-primary-foreground rounded-full p-1.5 sm:p-2 flex-shrink-0 mt-1 sm:mt-0">
                  {/* Next.js Icon Placeholder */}
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                </div>
               <div>
                 <h3 className="font-semibold text-base sm:text-lg">{t('nextjsTitle')}</h3>
                 <p className="text-xs sm:text-sm text-muted-foreground">{t('nextjsDescription')}</p>
               </div>
             </div>
             <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="bg-primary text-primary-foreground rounded-full p-1.5 sm:p-2 flex-shrink-0 mt-1 sm:mt-0">
                   {/* Tailwind/ShadCN Icon Placeholder */}
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>
                </div>
               <div>
                 <h3 className="font-semibold text-base sm:text-lg">{t('tailwindTitle')}</h3>
                 <p className="text-xs sm:text-sm text-muted-foreground">{t('tailwindDescription')}</p>
               </div>
             </div>
           </CardContent>
         </Card>
       </section>

      {/* Call to Action */}
       {/* Responsive padding, text size, button size */}
      <section className="text-center py-10 md:py-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4">{t('ctaTitle')}</h2>
        <p className="text-muted-foreground mb-6 md:mb-8 text-sm sm:text-base md:text-lg">{t('ctaDescription')}</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4"> {/* Responsive gap */}
          <Link href="/vote" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">{t('castYourVote')}</Button>
          </Link>
          <Link href="/results" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full">{t('viewResults')}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
