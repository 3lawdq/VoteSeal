/**
 * @fileOverview Configuration for the VoteChain smart contract.
 */

// The address of the deployed VoteChain smart contract.
// Replace with your actual deployed contract address.
export const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// The RPC target URL for the blockchain network.
// Replace with your actual RPC endpoint (e.g., Infura, Alchemy, or local node).
export const rpcTarget = 'https://vehicle-edinburgh-psi-honest.trycloudflare.com';

// Chain ID in Hexadecimal format (31337 -> 0x7a69)
// Replace with the correct chain ID for your target network.
// Hardhat default chain ID: 0x7a69
// Sepolia testnet: 0xaa36a7
export const chainIdHex = '0x7a69';

// Preferred IPFS Gateway URL (replace if needed)
// Ensure this gateway is accessible and reliable.
export const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';
// Alternative: 'https://ipfs.io/ipfs/'

// Add the ABI (Application Binary Interface) for the contract here.
// This must match the ABI of the deployed contract.
export const contractAbi = [
  {
    "inputs": [
      { "internalType": "string[]", "name": "_names", "type": "string[]" },
      { "internalType": "string[]", "name": "_parties", "type": "string[]" },
      { "internalType": "string[]", "name": "_manifestoCids", "type": "string[]" },
      { "internalType": "string[]", "name": "_photoUrls", "type": "string[]" },
      { "internalType": "uint256[]", "name": "_ages", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "_yearsOfExperience", "type": "uint256[]" },
      { "internalType": "string[]", "name": "_qualifications", "type": "string[]" },
      { "internalType": "string[]", "name": "_positions", "type": "string[]" },
      { "internalType": "uint256", "name": "_startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "_endTime", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  { "inputs": [], "name": "endTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "startTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "votingActive", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "endVoting", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_voter", "type": "address" }], "name": "registerVoter", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_candidateId", "type": "uint256" }], "name": "vote", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "getAllCandidates", "outputs": [
    {
      "components": [
        { "internalType": "uint256", "name": "id", "type": "uint256" },
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "string", "name": "party", "type": "string" },
        { "internalType": "uint256", "name": "age", "type": "uint256" },
        { "internalType": "uint256", "name": "yearsOfExperience", "type": "uint256" },
        { "internalType": "string", "name": "qualification", "type": "string" },
        { "internalType": "string", "name": "position", "type": "string" },
        { "internalType": "string", "name": "photoUrl", "type": "string" },
        { "internalType": "string", "name": "manifestoCid", "type": "string" },
        { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
      ],
      "internalType": "struct Voting.Candidate[]",
      "name": "",
      "type": "tuple[]"
    }
  ], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "hasVoted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "registeredVoters", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },

  // 🆕 Added Merkle-related functions
  { "inputs": [{ "internalType": "bytes32", "name": "root", "type": "bytes32" }], "name": "submitMerkleRoot", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [
      { "internalType": "bytes32[]", "name": "proof", "type": "bytes32[]" },
      { "internalType": "bytes32", "name": "leaf", "type": "bytes32" },
      { "internalType": "bytes32", "name": "root", "type": "bytes32" },
      { "internalType": "uint256", "name": "candidateId", "type": "uint256" }
    ],
    "name": "verifyAndRecordVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "merkleRoots", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },

  // Optional: Events
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "voter", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "candidateId", "type": "uint256" }], "name": "VoteCast", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "voter", "type": "address" }], "name": "VoterRegistered", "type": "event" },
  { "anonymous": false, "inputs": [], "name": "VotingEnded", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "candidateId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "voteCount", "type": "uint256" }], "name": "VotingResult", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256" }], "name": "VotingStarted", "type": "event" }
] as const; // Add 'as const' for better type inference

/**
 * Constructs the full URL for an IPFS resource using the preferred gateway.
 *
 * @param cidOrUrl The IPFS CID or a full IPFS URL (e.g., ipfs://...).
 * @returns The full URL pointing to the resource via the gateway, or an empty string if input is invalid.
 */
export function getIpfsUrl(cidOrUrl: string): string {
  if (!cidOrUrl) return '';

  // Check if it's already a full HTTPS URL (more robust check might be needed)
  if (cidOrUrl.startsWith('http://') || cidOrUrl.startsWith('https://')) {
      // If it's already a gateway URL, return as is.
      // If it points to a different gateway, maybe redirect or just use it? For now, use as is.
      return cidOrUrl;
  }

  // Handle ipfs:// protocol by replacing with the configured gateway
  if (cidOrUrl.startsWith('ipfs://')) {
      // Remove 'ipfs://' prefix and return the gateway URL
      const cid = cidOrUrl.substring(7);
      // Basic CID validation (optional but recommended)
      if (cid.length > 40) { // Basic check, can be improved
         return `${ipfsGateway}${cid}`;
      } else {
         console.warn(`getIpfsUrl: Potentially invalid CID format after ipfs:// prefix: ${cid}`);
         return ''; // Return empty if CID looks invalid
      }
  }

  // Assume it's just a CID if none of the above and perform basic validation
   if (cidOrUrl.length > 40) { // Basic check
      return `${ipfsGateway}${cidOrUrl}`;
   } else {
      console.warn(`getIpfsUrl: Input treated as CID might be invalid: ${cidOrUrl}`);
      return ''; // Return empty if CID looks invalid
   }
}
