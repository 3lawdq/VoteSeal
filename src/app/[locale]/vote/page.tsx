'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { contractAbi, contractAddress } from '@/config/contract';
import Web3 from 'web3';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  storeVoteLocally,
  getHasVotedLocal,
  // ❌ احذف السطر التالي إن لم تعد تحتاجه:
  // getVoteLeafByCandidate,
} from '@/lib/vote-storage';
import { syncOfflineVotes } from '@/services/sync-manager';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_VOTE_SECRET!;

export default function VotePage() {
  const { provider, user } = useAuth();
  const [contract, setContract] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  /* 1️⃣ اكتشاف التصويت المحلّي مباشرة */
  useEffect(() => {
    setHasVoted(getHasVotedLocal());
  }, []);

  /* 2️⃣ تهيئة Web3+Contract */
  useEffect(() => {
    if (!provider) return;
    const web3 = new Web3(provider);
    setContract(new web3.eth.Contract(contractAbi, contractAddress));
  }, [provider]);

  /* 3️⃣ جلب المرشّحين وحالة التصويت من السلسلة */
  useEffect(() => {
    const fetchData = async () => {
      if (!contract) return;

      try {
        const all = await contract.methods.getAllCandidates().call();
        setCandidates(all);

        const votedOnChain =
          user?.address ? await contract.methods.hasVoted(user.address).call() : false;
        setHasVoted(votedOnChain || getHasVotedLocal());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contract, user?.address]);

  /* 4️⃣ التصويت */
  async function handleVote(candidateId: string) {
    if (hasVoted) return;

    if (!ENCRYPTION_KEY) {
      toast({ title: 'Missing encryption key', variant: 'destructive' });
      return;
    }

    try {
      storeVoteLocally(
        { candidateId, timestamp: Date.now(), voter: user?.address || '' },
        ENCRYPTION_KEY
      );
      setHasVoted(true);
      toast({ title: '✅ تم التصويت!', description: 'سيُرسَل تصويتك عند الاتصال.' });

      if (navigator.onLine && provider) await syncOfflineVotes(provider);
    } catch (err) {
      console.error(err);
      toast({ title: '❌ فشل التخزين', variant: 'destructive' });
    }
  }

  /* 5️⃣ الواجهة */
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">🗳️ Cast Your Vote</h1>

      {hasVoted && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded mb-4">
          ✅ تم التصويت! لا يمكنك التصويت مرة أخرى.
        </div>
      )}

      {loading ? (
        <p>Loading candidates...</p>
      ) : (
        <div className="grid gap-4">
          {candidates.map((c: any) => {
            const alreadyVoted = hasVoted; /* أبقِها بسيطة */

            return (
              <div key={c.id} className="border p-4 rounded-md">
                <h2 className="text-lg font-semibold">{c.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">{c.party}</p>

                <Button
                  onClick={() => handleVote(String(c.id))}
                  disabled={alreadyVoted}
                  className={alreadyVoted ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {alreadyVoted ? 'Voted' : `Vote for ${c.name}`}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
