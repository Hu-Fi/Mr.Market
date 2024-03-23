import * as ccxt from 'ccxt';
import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import * as jwt from 'jsonwebtoken';
import { FeeResponse } from 'src/common/types/rebalance/bigone';
import symbolsMap from 'src/modules/mixin/rebalance/bigone/symbols.json';

@Injectable()
export class BigoneService {
  private readonly apiBaseUrl = 'https://big.one/api/v3';
  private readonly feeBaseUrl = 'https://bigone.com';
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly ccxtInstance: ccxt.bigone;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('rebalance.bigone_api_key');
    this.apiSecret = this.configService.get<string>(
      'rebalance.bigone_api_secret',
    );
    this.ccxtInstance = new ccxt.bigone({
      apiKey: this.apiKey,
      secret: this.apiSecret,
    });
  }

  private generateJwtToken(): string {
    const nonce = Math.floor(new Date().getTime() * 1000000); // Current timestamp in nanoseconds
    const payload = {
      type: 'OpenAPIV2',
      sub: this.apiKey,
      nonce: nonce.toString(),
    };

    const token = jwt.sign(payload, this.apiSecret, {
      algorithm: 'HS256',
    });

    return `Bearer ${token}`;
  }

  getHeaders(): any {
    const token = this.generateJwtToken();
    return { Authorization: token };
  }

  async getWithdrawals(
    pageToken?: string,
    limit?: string,
    kind?: string,
    assetSymbol?: string,
  ): Promise<AxiosResponse<any>> {
    const queryParams = `?`;
    if (pageToken) `${queryParams}page_token=${pageToken}&`;
    if (limit) `${queryParams}limit=${limit}&`;
    if (kind) `${queryParams}kind=${kind}&`;
    if (assetSymbol) `${queryParams}asset_symbol=${assetSymbol}`;

    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/viewer/withdrawals${queryParams}`,
        {
          headers: this.getHeaders(),
        },
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        'Failed to fetch withdrawals',
        err.response?.status ?? 500,
      );
    }
  }

  async getWithdrawalByGuid(guid: string): Promise<AxiosResponse<any>> {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/viewer/withdrawals/${guid}`,
        {
          headers: this.getHeaders(),
        },
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        'Failed to fetch withdrawal by GUID',
        err.response?.status ?? 500,
      );
    }
  }

  async createWithdrawal(
    symbol: string,
    targetAddress: string,
    amount: string,
    memo?: string,
    guid?: string,
    gatewayName?: string,
  ): Promise<AxiosResponse<any>> {
    const data = {
      symbol,
      target_address: targetAddress,
      amount,
      memo,
      guid,
      gateway_name: gatewayName,
    };

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/viewer/withdrawals`,
        data,
        {
          headers: this.getHeaders(),
        },
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        'Failed to create withdrawal',
        err.response?.status ?? 500,
      );
    }
  }

  async cancelWithdrawal(guid: string): Promise<AxiosResponse<any>> {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/viewer/withdrawals/${guid}/cancel`,
        {},
        {
          headers: this.getHeaders(),
        },
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        'Failed to cancel withdrawal',
        err.response?.status ?? 500,
      );
    }
  }

  assetIDtoSymbol(asset_id: string): string {
    return symbolsMap[asset_id];
  }

  async getFeeBySymbol(symbol: string): Promise<string> {
    const URL = `${this.feeBaseUrl}/api/uc/v2/assets/${symbol.toUpperCase()}`;
    try {
      const response = await axios.get(URL);
      if (response.status !== 200) {
        throw new Error('BigOne getFeeBySymbol() failed');
      }
      const data: FeeResponse = response.data;
      if (data.data.binding_gateways.length === 0) {
        throw new Error(`BigOne doesn't have withdrawal gateway for ${symbol}`);
      }
      return data.data.binding_gateways[0].withdrawal_fee;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Request failed: ${error.message}`);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  }

  async getBigOneFeeByID(asset_id: string): Promise<string> {
    return this.getFeeBySymbol(this.assetIDtoSymbol(asset_id));
  }
}
