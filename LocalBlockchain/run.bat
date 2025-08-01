@echo off
setlocal enabledelayedexpansion

REM === Setup ===
set "PROJECT_DIR=%~dp0"
set "SCRIPT_DIR=%PROJECT_DIR%"
set "LOG_FILE=%SCRIPT_DIR%run.log"
set "TUNNEL_FILE=%SCRIPT_DIR%tunnel-output.txt"
set "TEMP_SCRIPT=%SCRIPT_DIR%scripts\temp-script.js"

echo [START] Execution started at %DATE% %TIME% > "%LOG_FILE%"
echo [INFO] Project directory: %PROJECT_DIR% >> "%LOG_FILE%"

REM === Step 1: Start Hardhat Node ===
echo [INFO] Starting Hardhat node... >> "%LOG_FILE%"
start /b cmd /c "cd /d %PROJECT_DIR% && npx hardhat node >> node.log 2>&1"
timeout /t 5 > nul

REM === Step 2: Start Cloudflare Tunnel ===
echo [INFO] Starting Cloudflare tunnel... >> "%LOG_FILE%"
start /b cmd /c "cloudflared tunnel --url http://localhost:8545 > \"%TUNNEL_FILE%\" 2>&1"
echo [INFO] Waiting for tunnel to be established... >> "%LOG_FILE%"
timeout /t 10 > nul

REM === Step 3: Extract Tunnel URL ===
echo [INFO] Extracting tunnel URL... >> "%LOG_FILE%"
set "TUNNEL_URL="

for /f "usebackq delims=" %%L in ("%TUNNEL_FILE%") do (
    echo %%L | findstr /i "trycloudflare.com" >nul
    if !errorlevel! == 0 (
        for %%A in (%%L) do (
            echo %%A | findstr /r "^https://.*trycloudflare.com$" >nul && set "TUNNEL_URL=%%A"
        )
    )
)

if not defined TUNNEL_URL (
    echo [ERROR] Failed to extract tunnel URL. >> "%LOG_FILE%"
    type "%TUNNEL_FILE%" >> "%LOG_FILE%"
    echo [FATAL] Aborting. >> "%LOG_FILE%"
    exit /b 1
)

echo [INFO] Tunnel URL: !TUNNEL_URL! >> "%LOG_FILE%"

REM === Step 4: Create temp-script.js ===
echo [INFO] Creating temp-script.js... >> "%LOG_FILE%"
if not exist "%SCRIPT_DIR%scripts" mkdir "%SCRIPT_DIR%scripts"
(
echo const fs = require('fs');
echo const Web3 = require('web3');
echo const web3 = new Web3('http://localhost:8545');
echo const VotingABI = JSON.parse(fs.readFileSync('artifacts/contracts/Voting.sol/Voting.json', 'utf8')).abi;
echo const contract = new web3.eth.Contract(VotingABI, '0x5fbdb2315678afecb367f032d93f642f64180aa3');
echo web3.eth.getAccounts().then(accounts => web3.eth.sendTransaction({from: accounts[0], to: '0xfc59E04e2C1e42c78B0fEA56371d3561F806bA19', value: web3.utils.toWei('10', 'ether')})).then(r => console.log('✅ ETH sent:', r.transactionHash));
echo web3.eth.getAccounts().then(accounts => { contract.methods.registerVoter('0xfc59E04e2C1e42c78B0fEA56371d3561F806bA19').send({ from: accounts[0] }).on('receipt', () => console.log('✅ Voter registered')).on('error', console.error); });
) > "%TEMP_SCRIPT%"

REM === Step 5: Run the script ===
echo [INFO] Running temp-script.js using Hardhat console... >> "%LOG_FILE%"
cd /d "%PROJECT_DIR%"
call npx hardhat run "%TEMP_SCRIPT%" --network localhost >> "%LOG_FILE%" 2>&1

REM === Step 6: Cleanup ===
echo [INFO] Cleaning up... >> "%LOG_FILE%"
del "%TEMP_SCRIPT%" >nul 2>&1

echo [DONE] Script completed at %DATE% %TIME% >> "%LOG_FILE%"
exit /b 0
