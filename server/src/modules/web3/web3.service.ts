import { Injectable, Logger } from '@nestjs/common';
import { BigNumber, Wallet, ethers } from 'ethers';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class Web3Service {
  private signers: { [key: number]: Wallet } = {};
  public readonly logger = new Logger(Web3Service.name);

  constructor(private readonly configService: ConfigService) {
    const privateKey = this.configService.get<string>('web3.private_key');

    const networks = [
      {
        chainId: 1,
        rpcUrl: this.configService.get<string>('web3.network.mainnet.rpc_url'),
      },
      {
        chainId: 11155111,
        rpcUrl: this.configService.get<string>('web3.network.sepolia.rpc_url'),
      },
      {
        chainId: 137,
        rpcUrl: this.configService.get<string>('web3.network.polygon.rpc_url'),
      },
      {
        chainId: 80002,
        rpcUrl: this.configService.get<string>(
          'web3.network.polygon_amoy.rpc_url',
        ),
      },
      {
        chainId: 56,
        rpcUrl: this.configService.get<string>('web3.network.bsc.rpc_url'),
      },
      {
        chainId: 97,
        rpcUrl: this.configService.get<string>(
          'web3.network.bsc_testnet.rpc_url',
        ),
      },
    ];

    for (const network of networks) {
      if (network.rpcUrl) {
        const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
        this.signers[network.chainId] = new Wallet(privateKey, provider);
      }
    }
  }

  public getSigner(chainId: number): Wallet {
    return this.signers[chainId];
  }

  public async calculateGasPrice(chainId: number): Promise<bigint> {
    const signer = this.getSigner(chainId);
    const multiplier = this.configService.get<number>('web3.gas_multiplier');
    const gasPrice = (await signer.provider?.getFeeData())?.gasPrice;
    if (gasPrice) {
      return gasPrice
        .mul(BigNumber.from(Math.round(multiplier * 100)))
        .div(BigNumber.from(100))
        .toBigInt();
    }
    throw new Error('Failed to get gas price');
  }

  public getOperatorAddress(): string {
    return Object.values(this.signers)[0].address;
  }

  async verifyTransactionDetails(
    chainId: number,
    transactionHash: string,
    expectedTokenAddress: string,
    expectedToAddress: string,
    expectedAmount: ethers.BigNumber,
  ): Promise<boolean> {
    const signer = this.getSigner(chainId);
    const transaction = await signer.provider?.getTransaction(transactionHash);
    const receipt = await signer.provider?.getTransactionReceipt(
      transactionHash,
    );

    if (!transaction || receipt?.status !== 1) {
      return false; // Transaction failed or not found
    }

    // Verify the transaction is to the correct token contract
    if (transaction.to?.toLowerCase() !== expectedTokenAddress.toLowerCase()) {
      return false;
    }

    // Decode transaction data for ERC-20 transfer
    const iface = new ethers.utils.Interface([
      'function transfer(address to, uint256 value)',
    ]);
    const decodedData = iface.decodeFunctionData('transfer', transaction.data);

    const toAddress = decodedData[0];
    const amount = decodedData[1];

    // Verify the recipient and amount
    return (
      toAddress.toLowerCase() === expectedToAddress.toLowerCase() &&
      amount.eq(expectedAmount)
    );
  }
}
