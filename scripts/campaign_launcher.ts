import { EscrowClient, StakingClient } from "@human-protocol/sdk";
import { Client as MinioClient } from "minio";
import { BigNumber, Signer, ethers } from "ethers";
import crypto, { sign } from "crypto";
import fs from "fs";
import path from "path";

import dotenv from "dotenv";

dotenv.config();

const minioClient = new MinioClient({
  endPoint: process.env.S3_ENDPOINT ?? "",
  port: process.env.S3_PORT ? parseInt(process.env.S3_PORT) : undefined,
  useSSL: false,
  accessKey: process.env.S3_ACCESS_KEY ?? "",
  secretKey: process.env.S3_SECRET_KEY ?? "",
});

const main = async () => {
  try {
    const rpcUrl = process.env.RPC_URL;
    console.log("RPC URL:", rpcUrl);

    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl) {
      throw new Error("RPC_URL is not defined in your environment variables.");
    }

    if (!privateKey) {
      throw new Error(
        "PRIVATE_KEY is not defined in your environment variables."
      );
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const signer: ethers.Signer = new ethers.Wallet(privateKey, provider);

    // // Await the result of approveStake
    const approved = await approveStake(signer, "0.5");
    console.log('Stake approved:', approved);

    // Await the result of stake
    const staked = await stake(signer, "0.5");
    console.log('Staked:', staked);

    // Await the result of createCampaignEscrow
    const escrowAddress = await createCampaignEscrow(signer);
    console.log("Escrow Address:", escrowAddress);

    // Define your manifest data
    const manifestData = {
      chainId: 80001,
      startBlock: 1698796800,
      requesterDescription: "0x63D4DFC8BEc2768B80C9a7fd4B3Ea049600f63fB",
      endBlock: 1706659200,
      exchangeName: "binance",
      tokenA: "ETH",
      tokenB: "USDT",
      campaignDuration: 7862400,
      fundAmount: 0.021,
      type: "CAMPAIGN",
      requestType: "CAMPAIGN",
    };
    
    const manifest = await createAndUploadManifest(manifestData, escrowAddress);
    console.log("Manifest url:", manifest.url);
    console.log("Manifest hash:", manifest.hash);

    // Await the result of setupEscrow
    const escrowSetup = await setupEscrow(
      signer,
      escrowAddress,
      manifest.url,
      manifest.hash
    );

    const fundEscrowAmount = await fundEscrow(
      signer,
      escrowAddress,
      manifestData.fundAmount.toString()
    );
    console.log("Escrow funded:", fundEscrowAmount);

    console.log("Escrow setup:", escrowSetup);
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
  }
};

const approveStake = async (signer: Signer, amountToBeApproved: string) => {
  try {
    const stakingClient = await StakingClient.build(signer);

    const amount = ethers.utils.parseUnits(amountToBeApproved, "ether"); // Convert from ETH to WEI
    const approved = await stakingClient.approveStake(amount);

    console.log("Approval status:", approved);

    return approved;
  } catch (error: any) {
    console.error(`Error in approveStake: ${error.message}`);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

const stake = async (signer: Signer, amountToBeStaked: string) => {
  try {
    const stakingClient = await StakingClient.build(signer);

    const amount = ethers.utils.parseUnits(amountToBeStaked, "ether"); // Convert from ETH to WEI
    const staked = await stakingClient.stake(amount);

    console.log("Stake status:", staked);

    return staked;
  } catch (error: any) {
    console.error(`Error in stake: ${error.message}`);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

const createCampaignEscrow = async (signer: Signer): Promise<string> => {
  try {
    const tokenAddress = process.env.HMT_ADDRESS;
    const userAddress = await signer.getAddress();

    if (!tokenAddress) {
      throw new Error(
        "HMT_ADDRESS is not defined in your environment variables."
      );
    }

    const trustedHandlers = [userAddress];
    const campaignLauncherId = "1";

    const escrowClient = await EscrowClient.build(signer);
    const escrowAddress = await escrowClient.createEscrow(
      tokenAddress,
      trustedHandlers,
      campaignLauncherId
    );

    console.log("Escrow Address:", escrowAddress);
    return escrowAddress;
  } catch (error: any) {
    console.error(`Error in createCampaignEscrow: ${error.message}`);
    throw error;
  }
};

const createAndUploadManifest = async (
  manifestData: any,
  escrowAddress: string
) => {
  try {
    // Convert to JSON and write to a file
    const manifestFileName = `manifest-${escrowAddress}.json`;
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
    const hash = crypto.createHash("sha256").update(fileContent).digest("hex");

    // Construct the URL for the file
    const publicUrl = `http://${process.env.S3_ENDPOINT}:${process.env.S3_PORT}/${process.env.S3_BUCKET}/${manifestFileName}`;

    // Return the URL and hash
    return { url: publicUrl, hash: hash };
  } catch (error: any) {
    console.error(`Error in createAndUploadManifest: ${error.message}`);
    throw error;
  }
};

const setupEscrow = async (
  signer: Signer,
  escrowAddress: string,
  manifestURL: string,
  manifestHash: string
) => {
  try {
    if (!escrowAddress) throw new Error("Escrow address is required.");
    if (!manifestURL) throw new Error("Manifest URL is required.");
    if (!manifestHash) throw new Error("Manifest hash is required.");

    const escrowClient = await EscrowClient.build(signer);

    const recordingOracleAddress = process.env.RECORDING_ORACLE_ADDRESS;
    const reputationOracleAddress = process.env.REPUTATION_ORACLE_ADDRESS;
    const exchangeOracleAddress = process.env.EXCHANGE_ORACLE_ADDRESS;

    if (
      !recordingOracleAddress ||
      !reputationOracleAddress ||
      !exchangeOracleAddress
    ) {
      throw new Error(
        "Oracle addresses must be defined in environment variables."
      );
    }

    const escrowConfig = {
      recordingOracle: recordingOracleAddress,
      reputationOracle: reputationOracleAddress,
      exchangeOracle: exchangeOracleAddress,
      recordingOracleFee: BigNumber.from(
        process.env.RECORDING_ORACLE_FEE || "1"
      ),
      reputationOracleFee: BigNumber.from(
        process.env.REPUTATION_ORACLE_FEE || "1"
      ),
      exchangeOracleFee: BigNumber.from(process.env.EXCHANGE_ORACLE_FEE || "1"),
      manifestUrl: manifestURL,
      manifestHash: manifestHash,
    };
    const escrowSetup = await escrowClient.setup(escrowAddress, escrowConfig);
    console.log("Escrow setup:", escrowSetup);
    return escrowSetup;
  } catch (error: any) {
    console.error(`Error in setupEscrow: ${error.message}`);
    throw error;
  }
};

const fundEscrow = async (
  signer: Signer,
  escrowAddress: string,
  amount: string
) => {
  try {
    if (!escrowAddress) throw new Error("Escrow address is required.");
    const escrowClient = await EscrowClient.build(signer);
    const fundAmount = ethers.utils.parseUnits(amount, "ether");
    const funded = await escrowClient.fund(
      escrowAddress,
      BigNumber.from(fundAmount)
    );
    console.log("Escrow funded:", funded);
    return funded;
  } catch (error: any) {
    console.error(`Error in fundEscrow: ${error.message}`);
    throw error;
  }
};

main();