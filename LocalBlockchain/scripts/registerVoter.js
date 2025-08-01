const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:8545'); // Use same port as Hardhat

const abi = JSON.parse(fs.readFileSync('artifacts/contracts/Voting.sol/Voting.json', 'utf8')).abi;
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const contract = new web3.eth.Contract(abi, contractAddress);

web3.eth.getAccounts().then(accounts => {
  contract.methods.registerVoter('0x2Cc35403B382b87828D8d3882acF3557319e4632')
    .send({ from: accounts[0] })
    .on('receipt', () => console.log('✅ Voter registered successfully'))
    .on('error', console.error);
});
