/**
 * BigoneService
 *
 * This service handles interactions with the BigOne exchange, including generating JWT tokens,
 * managing withdrawals, and retrieving withdrawal fees. It uses the CCXT library for some exchange operations
 * and Axios for HTTP requests.
 *
 * Dependencies:
 * - ConfigService: Provides configuration values from environment variables.
 * - CCXT: Cryptocurrency exchange trading library.
 * - Axios: HTTP client for making API requests.
 * - JWT: Library for generating JSON Web Tokens.
 * - Constants: ASSET_ID_SYMBOL_MAP for managing asset IDs and symbols.
 * - FeeResponse: Type definition for the fee response from BigOne.
 * - HttpException: Exception class for handling HTTP errors.
 *
 * Methods:
 *
 * - constructor: Initializes the service with the injected ConfigService and sets up the CCXT instance.
 *
 * - generateJwtToken(): Generates a JWT token for authenticating with the BigOne API.
 *
 * - getHeaders(): Returns the headers required for making authenticated requests to the BigOne API.
 *
 * - getWithdrawals(pageToken?: string, limit?: string, kind?: string, assetSymbol?: string): Retrieves a list of withdrawals with optional query parameters.
 *
 * - getWithdrawalByGuid(guid: string): Retrieves a specific withdrawal by its GUID.
 *
 * - createWithdrawal(symbol: string, targetAddress: string, amount: string, memo?: string, guid?: string, gatewayName?: string): Creates a new withdrawal request.
 *
 * - cancelWithdrawal(guid: string): Cancels a withdrawal request by its GUID.
 *
 * - getFeeBySymbol(symbol: string): Retrieves the withdrawal fee for a specific asset symbol.
 *
 * - getBigOneFeeByID(asset_id: string): Retrieves the withdrawal fee for a specific asset ID.
 *
 * Notes:
 * - We use BigOne because we can transfer asset from mixin to it for free and enjoy lower withdrawal fee, makes it more cost effective for rebalance.
 * - The service uses Axios for making HTTP requests to the BigOne API and handles errors appropriately.
 * - The generateJwtToken method creates a token required for authenticated API requests.
 * - The service includes methods for creating, retrieving, and canceling withdrawals, as well as fetching withdrawal fees.
 * - Error handling is implemented to log and manage errors during API interactions.
 */

import * as ccxt from 'ccxt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { Injectable, HttpException } from '@nestjs/common';
import { FeeResponse } from 'src/common/types/rebalance/bigone';

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
    if (pageToken)`${queryParams}page_token=${pageToken}&`;
    if (limit)`${queryParams}limit=${limit}&`;
    if (kind)`${queryParams}kind=${kind}&`;
    if (assetSymbol)`${queryParams}asset_symbol=${assetSymbol}`;

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
}
