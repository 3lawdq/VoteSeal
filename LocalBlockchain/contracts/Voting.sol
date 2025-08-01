// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 age;
        uint256 yearsOfExperience;
        string qualification;
        string position;
        string photoUrl;
        string manifestoCid;
        uint256 voteCount;
    }

    Candidate[] private candidateList;

    mapping(address => bool) public hasVoted;
    mapping(address => bool) public registeredVoters;

    mapping(address => bytes32) public merkleRoots;
    mapping(address => mapping(bytes32 => bool)) public voteSubmitted;

    bool public votingActive;
    uint256 public startTime;
    uint256 public endTime;

    // --- Events ---
    event VoterRegistered(address voter);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VotingStarted(uint256 startTime, uint256 endTime);
    event VotingEnded();
    event VotingResult(uint256 candidateId, string name, uint256 voteCount);
    event MerkleRootSubmitted(address indexed voter, bytes32 root);
    event VoteSubmitted(address indexed voter, string candidateName);

    // --- Modifiers ---
    modifier onlyRegisteredVoter() {
        require(registeredVoters[msg.sender], "Not a registered voter");
        _;
    }

    modifier whenVotingActive() {
        require(votingActive, "Voting is inactive");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Outside voting window");
        _;
    }

    constructor(
        address initialOwner,
        string[] memory _names,
        string[] memory _parties,
        string[] memory _manifestoCids,
        string[] memory _photoUrls,
        uint256[] memory _ages,
        uint256[] memory _yearsOfExperience,
        string[] memory _qualifications,
        string[] memory _positions,
        uint256 _startTime,
        uint256 _endTime
    ) Ownable(initialOwner) {
        uint256 _len = _names.length;
        require(
            _len == _parties.length &&
            _len == _manifestoCids.length &&
            _len == _photoUrls.length &&
            _len == _ages.length &&
            _len == _yearsOfExperience.length &&
            _len == _qualifications.length &&
            _len == _positions.length,
            "Mismatched input array lengths"
        );
        require(_startTime < _endTime, "Invalid time window");

        startTime = _startTime;
        endTime = _endTime;
        votingActive = true;

        for (uint256 i = 0; i < _len; ++i) {
            candidateList.push(Candidate({
                id: i + 1,
                name: _names[i],
                party: _parties[i],
                age: _ages[i],
                yearsOfExperience: _yearsOfExperience[i],
                qualification: _qualifications[i],
                position: _positions[i],
                photoUrl: _photoUrls[i],
                manifestoCid: _manifestoCids[i],
                voteCount: 0
            }));
        }

        emit VotingStarted(startTime, endTime);
    }

    // --- Register ---
    function registerVoter(address _voter) external onlyOwner {
        require(!registeredVoters[_voter], "Already registered");
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    // --- Direct Vote (online) ---
    function vote(uint256 _candidateId) external onlyRegisteredVoter whenVotingActive {
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateId > 0 && _candidateId <= candidateList.length, "Invalid candidate ID");

        hasVoted[msg.sender] = true;
        candidateList[_candidateId - 1].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    // --- Submit Merkle Root ---
    function submitMerkleRoot(bytes32 root) external {
        require(merkleRoots[msg.sender] == 0, "Root already submitted");
        merkleRoots[msg.sender] = root;
        emit MerkleRootSubmitted(msg.sender, root);
    }

    // --- Verify & Record Vote (Offline via Merkle) ---
    function verifyAndRecordVote(
        bytes32[] calldata proof,
        bytes32 leaf,
        bytes32 root,
        uint256 candidateId
    ) external onlyRegisteredVoter whenVotingActive {
        require(!hasVoted[msg.sender], "Already voted");
        require(merkleRoots[msg.sender] == root, "Merkle root mismatch");
        require(!voteSubmitted[msg.sender][leaf], "Vote already submitted");
        require(candidateId > 0 && candidateId <= candidateList.length, "Invalid candidate ID");

        bool valid = MerkleProof.verify(proof, root, leaf);
        require(valid, "Invalid Merkle proof");

        hasVoted[msg.sender] = true;
        voteSubmitted[msg.sender][leaf] = true;
        candidateList[candidateId - 1].voteCount++;

        emit VoteSubmitted(msg.sender, candidateList[candidateId - 1].name);
    }

    // --- End Voting ---
    function endVoting() external onlyOwner whenVotingActive {
        votingActive = false;
        emit VotingEnded();

        for (uint256 i = 0; i < candidateList.length; ++i) {
            Candidate memory c = candidateList[i];
            emit VotingResult(c.id, c.name, c.voteCount);
        }
    }

    // --- Views ---
    function getAllCandidates() external view returns (Candidate[] memory) {
        return candidateList;
    }

    function getCandidateCount() external view returns (uint256) {
        return candidateList.length;
    }

    function getMerkleRoot(address user) external view returns (bytes32) {
        return merkleRoots[user];
    }

    function votingStarted() public view returns (bool) {
        return block.timestamp >= startTime;
    }

    function votingEnded() public view returns (bool) {
        return block.timestamp > endTime;
    }
}
