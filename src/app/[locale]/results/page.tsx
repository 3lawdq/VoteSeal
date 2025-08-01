'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractAbi } from '@/config/contract';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2Icon, DownloadIcon } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { saveAs } from 'file-saver';
import { getLocalVotes } from '@/lib/vote-storage';
import SyncStatus from '@/components/SyncStatus';



const chartColors = ['#3b82f6', '#f97316', '#10b981', '#e11d48'];


export default function ResultsPage() {
  const { provider } = useAuth();

  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [votingStatus, setVotingStatus] = useState('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [initAttempted, setInitAttempted] = useState(false);
  const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_VOTE_SECRET!;
  const unsyncedVotes = useMemo(() => {
  if (typeof window === 'undefined') return [];
  return getLocalVotes(ENCRYPTION_KEY);
}, [candidates]);

  const fetchResults = useCallback(async () => {
    if (!provider) return;

    try {
      const web3 = new Web3(provider as any);
      const contract = new web3.eth.Contract(contractAbi, contractAddress);

      const data = await contract.methods.getAllCandidates().call();
      const startUnix = await contract.methods.startTime().call();
      const endUnix = await contract.methods.endTime().call();

      const now = new Date();
      const start = new Date(Number(startUnix) * 1000);
      const end = new Date(Number(endUnix) * 1000);

      let status = 'Not Started';
      if (now >= start && now <= end) status = 'In Progress';
      else if (now > end) status = 'Ended';

      const formatted = data.map((c: any, i: number) => ({
        id: i,
        name: c.name,
        voteCount: Number(c.voteCount),
        avatar: c.imageUrl?.startsWith('ipfs://')
          ? `https://ipfs.io/ipfs/${c.imageUrl.replace('ipfs://', '')}`
          : c.imageUrl || null
      }));

      setCandidates(formatted);
      setVotingStatus(status);
      setStartTime(start.toLocaleString());
      setEndTime(end.toLocaleString());
      setLastUpdated(now);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch election results',
        description: error.message || 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    if (!initAttempted && provider) {
      setInitAttempted(true);
      fetchResults();
    }
  }, [provider, initAttempted, fetchResults]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchResults();
  };

  const handleExport = () => {
    const rows = candidates.map(c => `${c.name},${c.voteCount}`);
    const blob = new Blob([`Name,Votes\n${rows.join('\n')}`], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `election_results_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const totalVotes = useMemo(() =>
    candidates.reduce((sum, c) => sum + Number(c.voteCount), 0), [candidates]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">📊 Election Results</h1>
          <p className="text-muted-foreground text-sm">Live blockchain data with exportable charts.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh}>🔄 Refresh</Button>
          <Button onClick={handleExport} variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">
          <Loader2Icon className="inline-block h-5 w-5 animate-spin mr-2" />
          Loading election data...
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-red-500 font-medium text-sm mt-4">⚠️ No candidate data found.</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            {candidates.map((c, idx) => (
              <div key={idx} className="border rounded p-4 shadow-sm flex items-center gap-4">
                {c.avatar ? (
                  <img src={c.avatar} alt={c.name} className="h-12 w-12 rounded-full object-cover border" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
                    {c.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted-foreground">🗳️ Votes: {c.voteCount}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-muted p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Bar Chart</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={candidates}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="voteCount">
                    {candidates.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-muted p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Pie Chart</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={candidates}
                    dataKey="voteCount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {candidates.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 text-sm">
            
            <p><strong>Total Votes:</strong> {totalVotes}</p>
            <p><strong>Voting Status:</strong> {votingStatus}</p>
            <p><strong>Start Time:</strong> {startTime}</p>
            <p><strong>End Time:</strong> {endTime}</p>
            <p><strong>Last Updated:</strong> {lastUpdated?.toLocaleString()}</p>
          </div>
          <SyncStatus />

        </>
      )}
    </div>
  );
}
