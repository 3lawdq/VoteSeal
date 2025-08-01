const Web3 = require("web3");
const fs = require("fs");
const path = require("path");

// Connect to local Hardhat node
const web3 = new Web3("http://127.0.0.1:8545");

async function main() {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];

    console.log("Deploying contract from:", deployer);

    // Read ABI and bytecode
    const artifactPath = path.resolve(__dirname, "../artifacts/contracts/Voting.sol/Voting.json");
    const { abi, bytecode } = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    // Define constructor arguments
    const names = ["Alice", "Bob"];
    const parties = ["Green", "Blue"];
    const manifestoCids = [
        "ipfs://bafybeigixsrxow3ouuwc6nllwprtanm6cx4jsirfkvn4bmcykwgpcv7dee",
        "ipfs://bafybeigixsrxow3ouuwc6nllwprtanm6cx4jsirfkvn4bmcykwgpcv7dee"
    ];
    const photoUrls = [
        "ipfs://bafkreigvy4awwkldrkb7352kpwgkkpop27nkx6n5h2denhazwpfvdb2364",
        "ipfs://bafybeiexbqrhbv4h2dgajmswrogr7fkq5uvyt3zyqrj5xjzcxc6zb6fogu"
    ];
    const ages = [40, 50];
    const experience = [10, 20];
    const qualifications = ["MBA", "PhD"];
    const positions = ["Mayor", "Governor"];

    const currentTime = Math.floor(Date.now() / 1000);
    const startTime = currentTime + 60;      // start in 1 minute
    const endTime = currentTime + 80000;     // end in ~22 hours

    // Create contract instance
    const contract = new web3.eth.Contract(abi);

    // Deploy contract with 11 constructor arguments (including `initialOwner`)
    const deployed = await contract.deploy({
        data: bytecode,
        arguments: [
            deployer,            // ✅ initialOwner for Ownable
            names,
            parties,
            manifestoCids,
            photoUrls,
            ages,
            experience,
            qualifications,
            positions,
            startTime,
            endTime
        ]
    }).send({
        from: deployer,
        gas: 6000000
    });

    console.log("✅ Contract deployed at:", deployed.options.address);
}

main().catch(err => {
    console.error("❌ Deployment error:", err);
});
