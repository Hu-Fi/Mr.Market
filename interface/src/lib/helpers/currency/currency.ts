// This file is used to handle the currency rate conversion in the wallet section of the front page

import type { ChainLinkResponseData, FiatRateItem } from "$lib/types/currency/currency";
import { BALANCE_CURRENCIES, BALANCE_CURRENCY_USDFIAT_URL, BALANCE_CURRENCY_USDUSDT_URL } from "../constants";

// Reuqest ChainLink USDT/USD Oracle
export const getUSDTUSDRate = async () => {
    try {
        const response = await fetch(`${BALANCE_CURRENCY_USDUSDT_URL}/?query=FEED_DATA_QUERY&variables=%7B%22schemaName%22%3A%22ethereum-mainnet%22%2C%22contractAddress%22%3A%220x0d5f4aadf3fde31bbb55db5f42c080f18ad54df5%22%7D`);
        // {
        //     "data": {
        //       "chainData": {
        //         "nodes": [
        //           {
        //             "blockTimestamp": "2024-11-04T06:28:47",
        //             "inputs": {
        //               "answer": 99921000,
        //               "observers": "DwMECQgFDQILBgwBDgoHAA==",
        //               "transmitter": "0x9a5b545aa8b6289288e529c4099b0cca62bcb708",
        //               "configDigest": "0x0001904ecf79340754053ca02a217d8cc322218784c5a7642444e7e1c3f25cc3",
        //               "observations": [
        //                 99905500,
        //                 99918117,
        //                 99918117,
        //                 99918117,
        //                 99921000,
        //                 99921000,
        //                 99921000,
        //                 99921000,
        //                 99921000,
        //                 99922000,
        //                 99922000,
        //                 99922000,
        //                 99930439,
        //                 99930439,
        //                 99930439,
        //                 99930877
        //               ],
        //               "epochAndRound": 14153990,
        //               "juelsPerFeeCoin": 230979060789549240000,
        //               "aggregatorRoundId": 116,
        //               "observationsTimestamp": 1730701706
        //             }
        //           }
        //         ]
        //       }
        //     }
        // }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return await response.json();
      } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
      }
}

export const parseUSDTUSDRate = (data: ChainLinkResponseData) => {
    try {
        const answer = data?.data?.chainData?.nodes?.[0]?.inputs?.answer;
        if (typeof answer !== 'number') {
            return null;
        }
        return answer / 100000000;
    } catch (error) {
        // console.error('Error parsing USDT/USD rate:', error);
        return null;
    }
}

export const formatRequestPairs = (currencies: string[]) => {
    // filter USDT and USD
    const filteredCurrencies = currencies.filter(currency => currency !== 'USDT' && currency !== 'USD')
    // Map USD to each currency except USD
    const mappedCurrencies = filteredCurrencies.map(currency => `USD${currency}`)
    return mappedCurrencies.join(',')
}

// Request HSBC Fiat Rate API
export const getUSDFiatRate = async (currencies: string[]) => {
    try {
        const pairs = formatRequestPairs(currencies)
        const response = await fetch(`${BALANCE_CURRENCY_USDFIAT_URL}/?ccyPairs=${pairs}&range=day`)
        // [
        //     {
        //       "ccyPair": "USDJPY",
        //       "dataSet": [
        //         {
        //           "open": 152.98,
        //           "timestamp": 1730634000000
        //         },
        //         {
        //           "open": 152.98,
        //           "timestamp": 1730634600000
        //         },
        //       ],
        //       "latest": {
        //         "open": 151.6,
        //         "invertedOpen": 0.006596,
        //         "timestamp": 1730720700000
        //       },
        //       "decimalPlaces": 2,
        //       "decimalPlacesForInverted": 6,
        //       "high": 153,
        //       "low": 151.59
        //     },
        //     {
        //         "ccyPair": "USDAED",
        //         "dataSet": [
        //         {
        //             "open": 3.673,
        //             "timestamp": 1730634000000
        //         },
        //         {
        //             "open": 3.673,
        //             "timestamp": 1730634600000
        //         },
        //         ],
        //         "latest": {
        //         "open": 3.673,
        //         "invertedOpen": 0.2723,
        //         "timestamp": 1730720700000
        //         },
        //         "decimalPlaces": 4,
        //         "decimalPlacesForInverted": 4,
        //         "high": 3.6731,
        //         "low": 3.673
        //     },
        // ]
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}

export const parseUSDFiatRate = (data: FiatRateItem[]): { [key: string]: number } | null => {
    try {
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: expected an array');
        }

        return data.reduce((acc: { [key: string]: number }, item: FiatRateItem) => {
            if (typeof item.ccyPair !== 'string' || typeof item.latest?.open !== 'number') {
                throw new Error('Invalid item format in data array');
            }

            const currency = item.ccyPair.replace('USD', '');
            acc[currency] = item.latest.open;
            return acc;
        }, {});
    } catch (error) {
        console.error('Error parsing USD Fiat rate:', error);
        return null;
    }
}

export const getCurrencyRate = async (currencies: string[] = BALANCE_CURRENCIES) => {
    const [usdtUSD, usdFiat] = await Promise.all([getUSDTUSDRate(), getUSDFiatRate(currencies)]);
    const usdtUSDValue = parseUSDTUSDRate(usdtUSD)
    const usdFiatValue = parseUSDFiatRate(usdFiat)
    return {
        'USD': 1,
        'USDT': usdtUSDValue,
        ...usdFiatValue,
    }
}