// Import necessary libraries
import { ethers } from 'ethers';
import { EscrowClient, StakingClient } from '@human-protocol/sdk';
import dotenv from 'dotenv';
import { BigNumber } from 'ethers';
import { Client as MinioClient } from 'minio';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import exp from 'constants';

// Load environment variables for testing
dotenv.config({ path: './.env.test' });

describe('Human Protocol SDK Integration Tests using HuFi as example.', () => {
  let minioClient:MinioClient, signer:ethers.Signer, escrowClient: EscrowClient, stakingClient:StakingClient;
  let escrowAddress:string, hash:string, publicUrl:string, amount:any;

  beforeAll(async () => {
    // Initialize MinioClient with test configuration
    minioClient = new MinioClient({
      endPoint: process.env.S3_ENDPOINT ?? '',
      port: parseInt(process.env.S3_PORT ?? ''),
      useSSL: process.env.S3_USE_SSL === 'true',
      accessKey: process.env.S3_ACCESS_KEY  ?? '',
      secretKey: process.env.S3_SECRET_KEY  ?? ''
    });

    if (!process.env.RPC_URL || !process.env.PRIVATE_KEY) {
      throw new Error('RPC_URL or Private key is not defined in your environment variables.');
    }

    amount = ethers.utils.parseUnits('0.5', "ether"); // Convert from ETH to WEI
    // Initialize Ethereum signer with a test account
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Initialize SDK clients
    escrowClient = await EscrowClient.build(signer);
    stakingClient = await StakingClient.build(signer);
  }, 100000);

test('should approve token for staking contract', async () => {
  const approveTx = await stakingClient.tokenContract.approve(stakingClient.stakingContract.address, amount);

  // Wait for the transaction to be mined
  const receipt = await approveTx.wait();

  const signerAddress = await signer.getAddress();

  // Now fetch the allowance
  const allowance = await stakingClient.tokenContract.allowance(signerAddress, stakingClient.stakingContract.address);

  expect(allowance).toBeDefined();
  expect(allowance.gte(amount)).toBeTruthy(); // Check if allowance is greater than or equal to the amount
}, 100000);

  
  test('should stake token', async () => {
    await stakingClient.stake(amount);
  
    const signerAddress = await signer.getAddress();
    const stakedTokens = await stakingClient.stakingContract.getStakedTokens(signerAddress);
  
    expect(stakedTokens).toBeDefined();
    expect(stakedTokens.gte(amount)).toBeTruthy(); // Check if staked tokens are greater than or equal to the amount
  },100000);

  test('should create an escrow', async () => {
    const tokenAddress = process.env.HMT_ADDRESS ?? ''; 
    const trustedHandlers = [await signer.getAddress()];
    expect(trustedHandlers).toBeDefined(); 
    const campaignId = '1'; 
  
    escrowAddress = await escrowClient.createEscrow(tokenAddress, trustedHandlers, campaignId);
    expect(escrowAddress).toBeDefined();
  
    // Check if the escrowAddress is a valid Ethereum address
    expect(ethers.utils.isAddress(escrowAddress)).toBeTruthy();
  
  }, 100000);

  test('should create and upload a manifest using the details', async () => {
        // Define your manifest data
        const manifestData = {
            chainId: 80001,
            startBlock: 1698796800,
            requesterDescription: await signer.getAddress(),
            endBlock: 1706659200,
            exchangeName: "uniswap-ethereum",
            tokenA: "WETH",
            tokenB: "USDC",
            campaignDuration: 7862400,
            fundAmount: (await stakingClient.stakingContract.getStakedTokens(await signer.getAddress())).toString(),
            type: "CAMPAIGN",
            requestType: "CAMPAIGN",
          };
          
        // Convert to JSON and write to a file
        const manifestFileName = `manifest-test.json`;
        fs.writeFileSync(manifestFileName, JSON.stringify(manifestData));
    
        // Upload to MinIO
        const filePath = path.join(__dirname, manifestFileName);
        if (!process.env.S3_BUCKET) {
          throw new Error(
            "S3_BUCKET is not defined in your environment variables."
          );
        }
        await minioClient.fPutObject(
          process.env.S3_BUCKET,
          manifestFileName,
          filePath,
          {}
        );
    
        // Generate hash of the file content
        const fileContent = fs.readFileSync(manifestFileName);
        hash = crypto.createHash("sha256").update(fileContent).digest("hex");
    
        // Construct the URL for the file
        publicUrl = `http://${process.env.S3_ENDPOINT}:${process.env.S3_PORT}/${process.env.S3_BUCKET}/${manifestFileName}`;
        
        expect(publicUrl).toBeDefined();
        expect(hash).toBeDefined();
          // Check if publicUrl is a valid URL
        try {
            new URL(publicUrl);
            expect(true).toBeTruthy(); // If URL constructor doesn't throw, URL is valid
        } catch (error) {
            expect(error).toBeUndefined(); // Fail the test if an error is thrown
        }

        // Check if hash is a valid SHA-256 hash
        const sha256Regex = /^[a-f0-9]{64}$/i;
        expect(sha256Regex.test(hash)).toBeTruthy();
  },100000)


  test('should setup escrow', async () => {
  
    const escrowConfig = {
      recordingOracle: process.env.RECORDING_ORACLE_ADDRESS ?? '',
      reputationOracle: process.env.REPUTATION_ORACLE_ADDRESS ?? '',
      exchangeOracle:process.env.EXCHANGE_ORACLE_ADDRESS ?? '',
      recordingOracleFee: BigNumber.from(process.env.RECORDING_ORACLE_FEE || "1"),
      reputationOracleFee: BigNumber.from(process.env.REPUTATION_ORACLE_FEE || "1"),
      exchangeOracleFee: BigNumber.from(process.env.EXCHANGE_ORACLE_FEE || "1"),
      manifestUrl: publicUrl,
      manifestHash: hash,
    };
  
    await escrowClient.setup(escrowAddress, escrowConfig);


    //  This because the setup function doesn't return anything
    //  Polling for changes
    let manifestUrl, recordingOracleAddress, reputationOracleAddress, exchangeOracleAddress;
    for (let i = 0; i < 10; i++) { // Try 10 times
      manifestUrl = await escrowClient.getManifestUrl(escrowAddress);
      recordingOracleAddress = await escrowClient.getRecordingOracleAddress(escrowAddress);
      reputationOracleAddress = await escrowClient.getReputationOracleAddress(escrowAddress);
      exchangeOracleAddress = await escrowClient.getExchangeOracleAddress(escrowAddress);
  
      if (manifestUrl !== "" ) {
        break; // Break the url is fetched
      }
  
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before the next check
    }
  
    // Verify that the escrow setup matches the configuration
    expect(manifestUrl).toEqual(publicUrl);
    expect(await escrowClient.getManifestHash(escrowAddress)).toEqual(hash);
    expect(recordingOracleAddress).toEqual(escrowConfig.recordingOracle);
    expect(reputationOracleAddress).toEqual(escrowConfig.reputationOracle);
    expect(exchangeOracleAddress).toEqual(escrowConfig.exchangeOracle);
   
  }, 100000);
  
  test('should allocate funds to escrow from the staking contract', async () => {
    const allocateTx = await stakingClient.stakingContract.allocate(escrowAddress, amount);
    const receipt = await allocateTx.wait();

    const allocated = await stakingClient.getAllocation(escrowAddress)
    

    expect(allocated.tokens.toString()).toEqual(amount.toString());
  }, 100000);

//   test('should fund escrow directly', async () => {
//     await escrowClient.fund(escrowAddress, BigNumber.from(amount));
//     let balance;
//     for (let i = 0; i < 10; i++) { // Try 10 times
//       balance = await escrowClient.getBalance(escrowAddress);
//       if (balance.toString() !== "0") {
//         break; // Break the url is fetched
//       }
//       await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before the next check
//     }
//     expect(balance?.toString()).toEqual(amount.toString());
    
//   },100000);

  // Cleanup after all tests
  afterAll(() => {
    // Perform any necessary cleanup
  });
});