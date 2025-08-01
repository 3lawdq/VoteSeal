const Web3 = require("web3");

async function main() {
  const web3 = new Web3("http://127.0.0.1:8545");
  const accounts = await web3.eth.getAccounts();

  const receipt = await web3.eth.sendTransaction({
    from: accounts[0],
    to: "0x2Cc35403B382b87828D8d3882acF3557319e4632",
    value: web3.utils.toWei("10", "ether")
  });

  console.log("✅ ETH sent:", receipt.transactionHash);
}

main().catch(console.error);
