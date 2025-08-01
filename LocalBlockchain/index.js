const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hardhat node is exposed via Ngrok.");
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});

// Start Hardhat node
const hardhat = exec("npx hardhat node", { cwd: __dirname });
hardhat.stdout.on("data", (data) => {
  console.log(`HARDHAT: ${data}`);
});
hardhat.stderr.on("data", (data) => {
  console.error(`HARDHAT ERROR: ${data}`);
});
