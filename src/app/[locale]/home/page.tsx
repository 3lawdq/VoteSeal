'use client';

import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { Link } from '@/navigation'; // Use localized Link
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Loader2, UserCheck, Vote, WalletCardsIcon, InfoIcon, CopyIcon, BarChartHorizontal } from 'lucide-react'; // Changed BarChartIcon to BarChartHorizontal
import { Badge } from '@/components/ui/badge';
import { useTranslations, useLocale } from 'next-intl';
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function HomePage() {
  // --- Hooks (MUST be called at the top level) ---
  const t = useTranslations('HomePage');
  const tResults = useTranslations('ResultsPage'); // For 'na'
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const { user, isLoading: isAuthLoading, getBalance } = useAuth(); // isLoading covers auth init/login/logout
  const { toast } = useToast();
  const [currentBalance, setCurrentBalance] = useState<string | undefined>(undefined);
  const [isClient, setIsClient] = useState(false); // State for client mount

  // Memoize copyAddress function to prevent re-creation unless dependencies change
  const copyAddress = useCallback(async () => {
    if (!user?.address || !navigator.clipboard) return; // Check clipboard support
    try {
      await navigator.clipboard.writeText(user.address);
      toast({
        title: t('addressCopiedTitle'),
        description: t('addressCopiedDescription'),
      });
    } catch (err) {
      console.error("Failed to copy address: ", err);
      toast({
        variant: "destructive",
        title: t('copyFailTitle'),
        description: t('copyFailDescription'),
      });
    }
  }, [user?.address, toast, t]); // Dependencies: user address, toast, and translations

  // --- Effects (called after hooks) ---

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch balance when user object is available, auth is not loading, and component is mounted
  useEffect(() => {
    const fetchUserBalance = async () => {
      // Ensure we only run this logic on the client after mount and when user is present
      if (isClient && user?.address && !isAuthLoading) {
        try {
           console.log("HomePage: Fetching balance...");
           const balance = await getBalance();
           setCurrentBalance(balance); // Update balance state
           console.log("HomePage: Balance fetched:", balance);
        } catch (error) {
           console.error("HomePage: Error fetching balance:", error);
           // Optionally show a toast notification for balance fetch error
        }
      } else if (isClient && !user && !isAuthLoading) {
        // Clear balance if user logs out or isn't logged in after auth check
        setCurrentBalance(undefined);
      }
    };

    fetchUserBalance();
  // Re-run effect only when relevant dependencies change
  }, [isClient, user?.address, isAuthLoading, getBalance]); // Dependencies: isClient, user address, auth loading state, getBalance function


  // --- Rendering Logic (Conditional Returns based on hook state) ---

  // 1. Initial Server Render / Before Client Mount: Show Skeleton
  if (!isClient) {
    return (
      <div className="space-y-8 md:space-y-10"> {/* Responsive spacing */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
          <div>
            <Skeleton className="h-8 w-48 sm:h-10 sm:w-64 mb-2" /> {/* Responsive height/width */}
            <Skeleton className="h-5 w-64 sm:h-6 sm:w-80" /> {/* Responsive height/width */}
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4"> {/* Responsive gap */}
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="p-4 sm:p-5"> {/* Responsive padding */}
                <Skeleton className="h-5 w-1/2 mb-1" /> {/* Adjusted height */}
                <Skeleton className="h-4 w-3/4" /> {/* Adjusted height */}
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3"> {/* Responsive padding */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardContent className="p-4 sm:p-5 pt-0 mt-auto"> {/* Responsive padding */}
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 2. Client Mounted: Check Auth Loading State
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] flex-col space-y-3"> {/* Responsive min-height */}
        <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" /> {/* Responsive size */}
        <p className="text-base sm:text-lg text-muted-foreground">{t('loading')}</p> {/* Responsive text size */}
      </div>
    );
  }

  // 3. Client Mounted, Auth Done, User Not Logged In
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] space-y-4 text-center p-4 sm:p-6 border rounded-lg shadow-sm bg-card"> {/* Responsive padding */}
        <h2 className="text-xl sm:text-2xl font-semibold text-destructive">{t('authRequiredTitle')}</h2> {/* Responsive text size */}
        <p className="text-muted-foreground text-sm sm:text-base">{t('authRequiredDescription')}</p> {/* Responsive text size */}
        {/* Redirecting to landing page should be handled by middleware ideally */}
        <Link href="/">
          <Button variant="secondary">{t('goToLanding')}</Button>
        </Link>
      </div>
    );
  }

  // 4. Client Mounted, Auth Done, User Logged In: Render Dashboard
  const formatAddress = (address: string | undefined) => {
    if (!address) return tResults('na');
    if (address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  return (
    <TooltipProvider>
      <div className="space-y-8 md:space-y-10" dir={dir}> {/* Responsive spacing */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
          <div>
            {/* Responsive text sizes */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl text-foreground">{t('welcome')}</h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-1">{t('dashboardDescription')}</p>
          </div>
        </div>

        {/* Responsive grid layout */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* User Info Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border/60 rounded-lg overflow-hidden">
             {/* Responsive padding */}
            <CardHeader className="bg-gradient-to-br from-card to-accent/10 p-4 sm:p-5">
              {/* Responsive title size */}
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-foreground">
                <UserCheck className="text-primary" />
                {t('yourStatusTitle')}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t('yourStatusDescription')}</CardDescription> {/* Responsive description size */}
            </CardHeader>
             {/* Responsive padding and text size */}
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-col gap-2">
  <div className="flex justify-between items-center">
    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('walletAddress')}</p>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={copyAddress}
          className="flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-ring rounded"
        >
          <Badge variant="secondary" className="font-mono text-xs px-2 py-1 truncate cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
            {formatAddress(user.address)}
          </Badge>
          <CopyIcon className="h-3 w-3 text-muted-foreground hover:text-primary transition-colors" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('copyAddressTooltip')}</p>
      </TooltipContent>
    </Tooltip>
  </div>

  {/*  حقل قابل للتحديد يدويًا – يظهر العنوان الكامل للنسخ اليدوي */}
  <input
    readOnly
    value={user.address}
    className="text-xs sm:text-sm font-mono border px-2 py-1 rounded bg-muted/10 text-foreground w-full"
    onFocus={(e) => e.target.select()}
  />
</div>

               {/* Display balance state, show loading indicator if balance is fetching */}
              <div className="flex justify-between items-center gap-2">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('balance')}</p>
                  {currentBalance !== undefined ? (
                     <p className="text-xs sm:text-sm font-semibold text-foreground">{currentBalance} ETH</p>
                   ) : (
                      <Skeleton className="h-4 w-16" /> // Skeleton for balance
                   )}
              </div>
              {user.email && (
                <div className="flex justify-between items-center gap-2">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('email')}</p>
                   {/* Ensure email does not overflow */}
                  <p className="text-xs sm:text-sm text-foreground truncate max-w-[150px] xs:max-w-[180px] sm:max-w-full" title={user.email}>{user.email}</p>
                </div>
              )}
              {user.chainId && (
                <div className="flex justify-between items-center gap-2">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('network')}</p>
                  <p className="text-xs sm:text-sm text-foreground">
                    {t('chainId', { chainId: user.chainId })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cast Vote Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border/60 rounded-lg overflow-hidden flex flex-col">
            <CardHeader className="p-4 sm:p-5"> {/* Responsive padding */}
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-foreground"> {/* Responsive title size */}
                <Vote className="text-primary" />
                {t('castVoteTitle')}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t('castVoteDescription')}</CardDescription> {/* Responsive description size */}
            </CardHeader>
            <CardContent className="p-4 sm:p-5 flex-grow"> {/* Responsive padding */}
              <p className="text-sm sm:text-base text-muted-foreground mb-4">{t('castVoteContent')}</p> {/* Responsive text size */}
            </CardContent>
            <CardContent className="p-4 sm:p-5 pt-0 mt-auto"> {/* Responsive padding */}
              <Link href="/vote" className="block">
                <Button className="w-full shadow-sm hover:shadow-md transition-shadow">
                  <WalletCardsIcon className="mr-2 h-4 w-4" />
                  {t('goToVotePage')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* View Results Card */}
           <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border/60 rounded-lg overflow-hidden flex flex-col">
            <CardHeader className="p-4 sm:p-5"> {/* Responsive padding */}
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-foreground"> {/* Responsive title size */}
                 <BarChartHorizontal className="text-primary" />
                {t('viewResultsTitle')}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t('viewResultsDescription')}</CardDescription> {/* Responsive description size */}
            </CardHeader>
            <CardContent className="p-4 sm:p-5 flex-grow"> {/* Responsive padding */}
               <p className="text-sm sm:text-base text-muted-foreground mb-4">{t('viewResultsContent')}</p> {/* Responsive text size */}
            </CardContent>
             <CardContent className="p-4 sm:p-5 pt-0 mt-auto"> {/* Responsive padding */}
              <Link href="/results" className="block">
                 <Button variant="outline" className="w-full border-border hover:border-primary/40 transition-colors">
                  <BarChartHorizontal className="mr-2 h-4 w-4" />
                  {t('goToResultsPage')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* About Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border/60 rounded-lg overflow-hidden flex flex-col">
            <CardHeader className="p-4 sm:p-5"> {/* Responsive padding */}
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-foreground"> {/* Responsive title size */}
                 <InfoIcon className="text-primary" />
                {t('aboutCardTitle')}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t('aboutCardDescription')}</CardDescription> {/* Responsive description size */}
            </CardHeader>
            <CardContent className="p-4 sm:p-5 flex-grow"> {/* Responsive padding */}
               <p className="text-sm sm:text-base text-muted-foreground mb-4">{t('aboutCardContent')}</p> {/* Responsive text size */}
            </CardContent>
             <CardContent className="p-4 sm:p-5 pt-0 mt-auto"> {/* Responsive padding */}
              <Link href="/about" className="block">
                 <Button variant="outline" className="w-full border-border hover:border-primary/40 transition-colors">
                  <InfoIcon className="mr-2 h-4 w-4" />
                  {t('goToAboutPage')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

    