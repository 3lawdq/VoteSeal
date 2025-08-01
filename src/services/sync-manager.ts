// lib/sync-manager.ts
import Web3 from 'web3';
import {
  getLocalVotes,
  clearLocalVotes
} from '@/lib/vote-storage';
import {
  createMerkleTree,
  getMerkleProof,
  getMerkleRoot,
  hashVote
} from '@/lib/merkle-utils';
import { contractAddress, contractAbi } from '@/config/contract';
import type { EncryptedVote } from '@/lib/vote-storage';
import type { MerkleTree } from 'merkletreejs'; // ✅ Fix: Add type import

// 🔑 Load decryption key from env
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_VOTE_SECRET!;
if (!ENCRYPTION_KEY) {
  throw new Error('Missing NEXT_PUBLIC_VOTE_SECRET in .env.local');
}

export async function syncOfflineVotes(provider: any): Promise<void> {
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(contractAbi as any, contractAddress);

  const votes: EncryptedVote[] = getLocalVotes(ENCRYPTION_KEY);
  if (votes.length === 0) return;

  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];

  const tree: MerkleTree = createMerkleTree(votes);
  const leaves: Buffer[] = votes.map(vote => hashVote(vote));
  const root: string = getMerkleRoot(leaves); // ✅

  try {
    const existingRoot = await contract.methods.merkleRoots(sender).call();
    if (
      !existingRoot ||
      String(existingRoot) ===
        '0x0000000000000000000000000000000000000000000000000000000000000000'
    ) {
      await contract.methods.submitMerkleRoot(root).send({ from: sender });
      console.log('✅ Merkle root submitted:', root);
    }
  } catch (err) {
    console.error('❌ Failed to submit Merkle root:', err);
    return;
  }

  for (const vote of votes) {
    const proof = getMerkleProof(tree, vote);
    const leaf = hashVote(vote);

    try {
      await contract.methods
        .verifyAndRecordVote(
          proof,
          '0x' + leaf.toString('hex'),
          root,
          parseInt(vote.candidateId)
        )
        .send({ from: sender });

      console.log(`✅ Synced vote for candidate ${vote.candidateId}`);
    } catch (error) {
      console.error(
        `❌ Failed to sync vote for candidate ${vote.candidateId}:`,
        error
      );
    }
  }

  clearLocalVotes();
}
