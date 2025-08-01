require("@nomiclabs/hardhat-web3");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      initialBaseFeePerGas: 0,
      gasPrice: 8000000000,
    },
    ngrok: {
      url: "https://39d9-34-93-103-36.ngrok-free.app",  // Your public ngrok URL (unchanged)
      chainId: 31337,
      accounts: [
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
      ],
    },
    cloudflared: {
      url: "https://vehicle-edinburgh-psi-honest.trycloudflare.com",
      chainId: 31337,
      accounts: [
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
      ],
    },
  },
};
