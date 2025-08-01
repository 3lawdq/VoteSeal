// lib/vote-storage.ts
import * as CryptoJS from 'crypto-js';
import { getMerkleRoot, hashVote } from './merkle-utils';

const STORAGE_KEY = 'votechain_offline_votes';
const HAS_VOTED_KEY = 'votechain_has_voted';

export function getHasVotedLocal(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(HAS_VOTED_KEY) === 'true';
}

export function setHasVotedLocal(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HAS_VOTED_KEY, 'true');
}
export interface EncryptedVote {
  candidateId: string;
  timestamp: number;
  voter?: string;
}

// 🔐 Encrypt a vote
export function encryptVote(vote: EncryptedVote, key: string): string {
  return CryptoJS.AES.encrypt(JSON.stringify(vote), key).toString();
}

// 🔓 Decrypt a vote
export function decryptVote(cipher: string, key: string): EncryptedVote | null {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

// 💾 Store vote locally (encrypted)
export function storeVoteLocally(vote: EncryptedVote, key: string): void {
  if (getHasVotedLocal()) {
    throw new Error('User has already voted locally.');
  }
  const existing = getLocalVotesRaw();
  const encrypted = encryptVote(vote, key);
  existing.push(encrypted);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  setHasVotedLocal();          // ✅ صوّت الآن
}

// 📤 Get decrypted votes
export function getLocalVotes(key: string): EncryptedVote[] {
  const raw = getLocalVotesRaw();
  return raw.map(cipher => decryptVote(cipher, key)).filter(Boolean) as EncryptedVote[];
}

// 📦 Get raw encrypted votes
export function getLocalVotesRaw(): string[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// 🧹 Clear all stored votes
export function clearLocalVotes(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(HAS_VOTED_KEY);
}

// 🧽 Remove only one vote
export function removeSyncedVote(candidateId: string, key: string): void {
  const filtered = getLocalVotes(key).filter(v => v.candidateId !== candidateId);
  const reEncrypted = filtered.map(v => encryptVote(v, key));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reEncrypted));
}

// 🌿 Build Merkle root from stored votes
export function getMerkleRootFromStoredVotes(key: string): string | null {
  const votes = getLocalVotes(key);
  if (votes.length === 0) return null;
  const leaves: Buffer[] = votes.map(hashVote); // ✅ Fix type explicitly
  return getMerkleRoot(leaves);
}

// 🔍 Get specific vote & leaf
export function getVoteLeafByCandidate(candidateId: string, key: string): {
  vote: EncryptedVote;
  leaf: string;
} | null {
  const votes = getLocalVotes(key);
  const vote = votes.find(v => v.candidateId === candidateId);
  if (!vote) return null;
  return {
    vote,
    leaf: hashVote(vote).toString('hex'),
  };
}
