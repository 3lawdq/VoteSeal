import keccak256 from 'keccak256';
import { MerkleTree } from 'merkletreejs';
import type { EncryptedVote } from './vote-storage';

// 🔐 Hash vote to leaf
export function hashVote(vote: EncryptedVote): Buffer {
  return keccak256(`${vote.voter}-${vote.candidateId}-${vote.timestamp}`);
}

// 🌲 Create Merkle tree from votes
export function createMerkleTree(votes: EncryptedVote[]): MerkleTree {
  const leaves: Buffer[] = votes.map(hashVote);
  return new MerkleTree(leaves, keccak256, { sortPairs: true });
}

// 🔎 Get proof for a vote
export function getMerkleProof(tree: MerkleTree, vote: EncryptedVote): string[] {
  const leaf: Buffer = hashVote(vote);
  return tree.getHexProof(leaf);
}

// 📦 Get root of Merkle tree
export function getMerkleRoot(leaves: Buffer[]): string {
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  return tree.getHexRoot();
}


