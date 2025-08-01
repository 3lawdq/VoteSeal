'use client';

import React, { useEffect, useState } from 'react';
import { getLocalVotes } from '@/lib/vote-storage';
import { syncOfflineVotes } from '@/services/sync-manager';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2Icon } from 'lucide-react';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_VOTE_SECRET!;

export default function SyncStatus() {
  const { provider } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // 🔁 Check for local votes every 10 sec
  useEffect(() => {
    const checkVotes = () => {
      if (typeof window !== 'undefined') {
        const votes = getLocalVotes(ENCRYPTION_KEY);
        setPendingCount(votes.length);
      }
    };

    checkVotes(); // initial
    const interval = setInterval(checkVotes, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    if (!provider) return;

    setLoading(true);
    try {
      await syncOfflineVotes(provider);
      setLastSync(new Date());
      setPendingCount(0);

      toast({
        title: '✅ Votes Synced Successfully',
        description: 'Your offline votes were submitted to the blockchain.',
      });
    } catch (err) {
      console.error('Sync failed:', err);
      toast({
        title: '❌ Sync Failed',
        description: 'Please try again later or check your connection.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (pendingCount === 0) return null;

  return (
    <>
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 p-4 rounded-md flex justify-between items-center mt-4">
        <div>
          ⚠️ <strong>{pendingCount}</strong> offline vote(s) pending sync.
        </div>
        <Button size="sm" onClick={() => setOpen(true)} variant="outline">
          Sync Now
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🔄 Sync Offline Votes</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2Icon className="animate-spin w-5 h-5" />
              <span>Syncing votes to blockchain...</span>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <p>Are you sure you want to sync your {pendingCount} offline vote(s)?</p>
              <DialogFooter>
                <Button onClick={handleSync}>✅ Confirm Sync</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
