
'use client';

import { useState, useEffect, ReactNode } from 'react';
import LoadingFallback from '@/app/[locale]/loading-fallback'; // Adjust path as needed

// Helper component to ensure children only render client-side
export default function ClientOnlyWrapper({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <LoadingFallback />; // Show loading fallback during SSR/initial mount
  }

  return <>{children}</>; // Render children only after mount
}
