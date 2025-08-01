
import { Loader2 } from 'lucide-react';

export default function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]"> {/* Adjust height as needed */}
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
