
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogInIcon, LogOutIcon, WalletIcon, Loader2, AlertCircleIcon, UserIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/auth-context';
import { useTranslations } from 'next-intl';
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { cn } from '@/lib/utils';

export default function Web3AuthButton() {
  const t = useTranslations('Web3AuthButton');
  const { user, isLoading, isConnecting, login, logout } = useAuth();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false); // State to track client-side mount

  // Ensure component only renders client-side logic after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async () => {
    // Error handling is centralized in AuthContext
    console.log("Web3AuthButton: Login initiated.");
    await login();
    console.log("Web3AuthButton: Login finished.");
  };

  const handleLogout = async () => {
    // Error handling is centralized in AuthContext
    console.log("Web3AuthButton: Logout initiated.");
    await logout();
    console.log("Web3AuthButton: Logout finished.");
  };

  // --- Render Logic ---

  // Render skeleton or placeholder during initial server render or before client mount
  if (!isClient) {
     // Responsive placeholder, adjust width for small screens
     return <Skeleton className="h-9 w-[40px] sm:w-[200px] rounded-md" />; // Smaller width for mobile skeleton
  }

  // Show loading indicator based on context state
  if (isLoading || isConnecting) {
    return (
      // Responsive button width, adjust min-width for small screens
      <Button disabled variant="outline" size="sm" className="w-auto sm:min-w-[190px] shrink-0 px-2 sm:px-3"> {/* Reduced padding on small */}
        <Loader2 className="mr-0 sm:mr-2 h-4 w-4 animate-spin" /> {/* Hide margin on small */}
        <span className="hidden sm:inline"> {/* Hide text on small */}
            {isConnecting ? t('connecting') : (isLoading && user) ? t('loggingOut') : t('initializing')}
        </span>
      </Button>
    );
  }

  // Render user dropdown if logged in
  if (user) {
     const getFallbackInitials = (address: string | undefined) => {
        if (!address || address.length < 4) return '??';
        // Use first 2 characters after '0x' for better uniqueness
        return address.substring(2, 4).toUpperCase();
     };

     const formatAddress = (address: string | undefined) => {
         if (!address) return t('myAccount');
         if (address.length < 10) return address;
         return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
     }

     return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           {/* Responsive trigger button width, adjust padding, add shrink-0 */}
          <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2 w-auto shrink-0 px-2 sm:px-3"> {/* Reduced gap and padding */}
             <Avatar className="h-6 w-6 flex-shrink-0">
               <AvatarImage src={user.profileImage || `https://avatar.vercel.sh/${user.address}.png?size=24`} alt={user.name || user.address || 'User Avatar'} />
               <AvatarFallback>
                 {getFallbackInitials(user.address)}
               </AvatarFallback>
            </Avatar>
             {/* Hide address text on small screens */}
            <span className="truncate hidden sm:inline">
               {formatAddress(user.address)}
             </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
           <DropdownMenuLabel className="flex items-center gap-2">
             <UserIcon className="h-4 w-4 text-muted-foreground" />
             {t('myAccount')}
           </DropdownMenuLabel>
           <DropdownMenuSeparator />
           <DropdownMenuItem disabled className="flex items-center gap-2 cursor-default text-xs">
             <WalletIcon className="mr-1 h-4 w-4 text-muted-foreground flex-shrink-0" />
             <span className="font-mono truncate" title={user.address}>
                 {user.address || t('address') + ' not available'}
             </span>
           </DropdownMenuItem>
           {user.email && (
            <DropdownMenuItem disabled className="flex items-center gap-2 cursor-default text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4 text-muted-foreground flex-shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
               <span className="truncate text-muted-foreground" title={user.email}>
                {user.email}
              </span>
            </DropdownMenuItem>
           )}
           {user.balance !== undefined && user.balance !== null && (
             <DropdownMenuItem disabled className="flex items-center gap-2 cursor-default text-xs">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4 text-muted-foreground flex-shrink-0"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
               <span className="text-muted-foreground">
                 {t('balance')}: {user.balance} ETH
               </span>
             </DropdownMenuItem>
           )}
            {user.chainId && (
             <DropdownMenuItem disabled className="flex items-center gap-2 cursor-default text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4 text-muted-foreground flex-shrink-0"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
               <span className="text-muted-foreground">
                 {t('chain')}: {user.chainId}
               </span>
             </DropdownMenuItem>
           )}

          <DropdownMenuSeparator />
           <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
             <LogOutIcon className="mr-2 h-4 w-4" />
            <span>{t('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Render login button if no user and not loading
  return (
     // Responsive button width and add shrink-0, adjust padding and hide text on small screens
    <Button onClick={handleLogin} variant="default" size="sm" disabled={isLoading || isConnecting} className="w-auto sm:min-w-[190px] shrink-0 px-2 sm:px-3"> {/* Reduced padding */}
      <LogInIcon className="mr-0 sm:mr-2 h-4 w-4" /> {/* Hide margin on small */}
      <span className="hidden sm:inline"> {/* Hide text on small */}
        {t('connectWalletLogin')}
      </span>
    </Button>
  );
}
    
