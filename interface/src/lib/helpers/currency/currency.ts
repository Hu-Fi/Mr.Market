// This file is used to handle the currency rate conversion in the wallet section of the front page
// https://github.com/fawazahmed0/exchange-api

import { BALANCE_CURRENCIES, BALANCE_CURRENCY_RATE_URL } from "../constants";

export const getCurrencyRate = async (currencies: string[] = BALANCE_CURRENCIES) => {
    try {
        const response = await fetch(BALANCE_CURRENCY_RATE_URL);
        if (!response.ok) {
            throw new Error(`Error fetching currency rates: ${response.statusText}`);
        }
        const data = await response.json();
        const list = data?.usdt;

        currencies = currencies.map(currency => currency.toUpperCase())
        // Filter the list by the specified currencies
        const filteredData = Object.keys(list)
            .filter(key => currencies.includes(key.toUpperCase()))
            .reduce((obj: Record<string, number>, key) => {
                obj[key.toUpperCase()] = list[key];
                return obj;
            }, {});
        return filteredData;
    } catch (error) {
        console.error("Failed to get currency rates:", error);
        throw error;
    }
}
