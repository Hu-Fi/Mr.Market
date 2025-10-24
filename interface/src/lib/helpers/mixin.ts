// @ts-nocheck
import axios from "axios";
import { get } from "svelte/store";
import authorize from "$lib/helpers/mixin-oauth";
import { getOauth } from "$lib/helpers/hufi/auth";
import { getOrdersByUser } from "$lib/helpers/hufi/spot";
import { decodeSymbolToAssetID } from "$lib/helpers/utils";
import { getAllStrategyByUser } from "$lib/helpers/hufi/strategy";
import { mixinConnectLoading, mixinConnected } from "$lib/stores/home";
import { buildMixinOneSafePaymentUri, getUuid, hashMembers } from "@mixin.dev/mixin-node-sdk";
import { AppURL, BOT_ID, BTC_UUID, MIXIN_API_BASE_URL, OAUTH_SCOPE } from "$lib/helpers/constants";
import { GenerateSpotTradingMemo, encodeArbitrageCreateMemo, encodeMarketMakingCreateMemo, encodeSimplyGrowCreateMemo } from "$lib/helpers/memo";
import { topAssetsCache, user, userAssets, userSpotOrders, userSpotOrdersLoaded, userStrategyOrdersLoaded } from "$lib/stores/wallet";

export const isIOS = () => {
  const ua = window?.navigator?.userAgent;
  const check = function (pattern: RegExp): boolean {
    return (pattern).test(ua);
  }
  return check(/\(i[^;]+;( U;)? CPU.+Mac OS X/i)
}

export const isMixin = () => {
  const ios = isIOS()
  return !!(ios
    ? window?.webkit?.messageHandlers?.MixinContext
    : window?.MixinContext && typeof window?.MixinContext?.getContext === 'function');
}

export const getMixinContext = () => {
  const ios = isIOS()
  return ios
    ? window?.webkit?.messageHandlers?.MixinContext
    : window?.MixinContext;
}

export const mixinShare = (url: string, title: string, description: string, icon_url: string) => {
  const data = {
    action: `${AppURL}${url}`,
    app_id: BOT_ID,
    description,
    icon_url,
    title,
  };
  window.open(`mixin://send?category=app_card&data=${encodeURIComponent(btoa(JSON.stringify(data)))}`)
}

export const mixinPay = ({ asset_id, amount, memo, trace_id }: { asset_id: string, amount: string, memo: string, trace_id: string }) => {
  window.open(buildMixinOneSafePaymentUri({
    uuid: BOT_ID,
    asset: asset_id,
    amount: amount,
    memo: memo,
    trace: trace_id,
  }))
  return trace_id
}

export const mixinUserMe = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios
    .get(MIXIN_API_BASE_URL + "/me", config);
  return result.data ? result.data.data : {};
}

export const mixinSafeAllOutputs = async (members: string[], token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const result = await axios
    .get(MIXIN_API_BASE_URL + `/safe/outputs?members=${hashMembers(members)}&threshold=1&offset=0&limit=1000&&order=ASC`, config);
  return result.data ? result.data.data : {};
}

export const mixinSafeOutputs = async (members: string[], token: string, spent: boolean = false) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const result = await axios
    .get(MIXIN_API_BASE_URL + `/safe/outputs?members=${hashMembers(members)}&threshold=1&offset=0&limit=1000&state=${spent ? "spent" : "unspent"}&order=ASC`, config);
  return result.data ? result.data.data : {};
}

export const mixinTopAssets = async () => {
  const result = await axios
    .get(MIXIN_API_BASE_URL + `/network/assets/top`);

  return result.data ? result.data.data : {};
}

export const mixinAsset = async (asset_id: string) => {
  const result = await axios
    .get(MIXIN_API_BASE_URL + `/network/assets/${asset_id}`);

  return result.data ? result.data.data : {};
}

export const mixinSafeAsset = async (asset_id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const result = await axios
    .get(MIXIN_API_BASE_URL + `/safe/assets/${asset_id}`, config);
  return result.data ? result.data.data : {};
}

async function fetchTopAssetsCache() {
  const topAssets = await mixinTopAssets();
  const topCache = get(topAssetsCache)
  topAssets.forEach(asset => {
    topCache[asset.asset_id] = asset;
  });
  topAssetsCache.set(topCache)
  return topCache
}

async function getAssetDetails(asset_id: string, topAssetsCache: unknown) {
  if (topAssetsCache && topAssetsCache[asset_id]) {
    return topAssetsCache[asset_id];
  } else {
    // If not in cache, fetch the asset details
    return await mixinAsset(asset_id);
  }
}

// Step 2: Group UTXOs by asset_id and sum the amounts
export function groupAndSumUTXOs(outputs) {
  const balances = outputs.reduce((acc, output) => {
    const { asset_id, amount } = output;
    if (!acc[asset_id]) {
      acc[asset_id] = { balance: 0, asset_id };
    }
    acc[asset_id].balance += parseFloat(amount);
    return acc;
  }, {});
  return balances;
}

export async function calculateAndSortUSDBalances(balances, topAssetsCache) {
  for (const asset_id in balances) {
    const assetDetails = await getAssetDetails(asset_id, topAssetsCache);
    balances[asset_id].usdBalance = balances[asset_id].balance * parseFloat(assetDetails.price_usd);
    balances[asset_id].details = assetDetails;
  }

  // Sort the balances by USD balance
  const sortedBalancesArray = Object.values(balances).sort((a, b) => b.usdBalance - a.usdBalance);
  return sortedBalancesArray; // You can keep it as an array since it's already sorted
}

// Step 5: Calculate total USD balance
export function calculateTotalUSDBalance(balances) {
  return Object.values(balances).reduce((acc, { usdBalance }) => acc + usdBalance, 0);
}

// Step 6: Calculate total BTC balance
async function calculateTotalBTCBalance(totalUSDBalance) {
  const btcDetails = await getAssetDetails(BTC_UUID, get(topAssetsCache))
  return totalUSDBalance / parseFloat(btcDetails.price_usd);
}

const getUserBalances = async (user_id: string, token: string) => {
  if (isMixin) {
    // TODO: implement get asset list from mixin webview context
  }
  const topAssetsCache = await fetchTopAssetsCache();
  const outputs = await mixinSafeOutputs([user_id], token)
  // console.log(outputs)
  let balances = groupAndSumUTXOs(outputs);
  balances = await calculateAndSortUSDBalances(balances, topAssetsCache);
  const totalUSDBalance = calculateTotalUSDBalance(balances);
  const totalBTCBalance = await calculateTotalBTCBalance(totalUSDBalance);
  userAssets.set({ balances, totalUSDBalance, totalBTCBalance })
  return { balances, totalUSDBalance, totalBTCBalance }
}

const getUserSpotOrders = async (user_id: string) => {
  try {
    const orders = await getOrdersByUser(user_id);
    console.log('getUserSpotOrders()=>', orders)
    if (!orders) {
      userSpotOrdersLoaded.set(true);
      return;
    }
    userSpotOrders.set(orders);
    userSpotOrdersLoaded.set(true);
  } catch (e) {
    userSpotOrders.set([]);
    userSpotOrdersLoaded.set(true);
    console.error(e);
  }
}

export const getUserStrategyOrders = async (user_id: string) => {
  try {
    const orders = await getAllStrategyByUser(user_id);
    console.log('getAllStrategyByUser()=>', orders)
    if (!orders) {
      userStrategyOrdersLoaded.set(true);
      return;
    }
    userStrategyOrdersLoaded.set(true);
  } catch (e) {
    userStrategyOrders.set([]);
    userStrategyOrdersLoaded.set(true);
    console.error(e);
  }
}

export const mixinAuthWrapper = async (pkce: boolean = false) => {
  mixinConnectLoading.set(true);
  authorize(
    { clientId: BOT_ID, scope: OAUTH_SCOPE, pkce },
    {
      onShowUrl: (url: string) => {
        window.open(url);
      },
      onError: (error: Error) => {
        console.error(error);
        mixinConnectLoading.set(false);
        return;
      },
      onSuccess: async (token: string) => {
        if (!pkce) {
          const result = await getOauth(token);
          if (result.token) {
            token = result.token
          } else {
            return;
          }
        }
        await AfterMixinOauth(token);
        mixinConnectLoading.set(false);
      },
    },
  );
}

export const AfterMixinOauth = async (token: string) => {
  // if (pkce) {
    const data = await mixinUserMe(token)
    if (!data) {
      console.log('!UserMe, remove mixin-oauth')
      localStorage.removeItem('mixin-oauth')
      return
    }
    if (data.full_name === '') {
      console.log('!UserMeError, remove mixin-oauth')
      localStorage.removeItem('mixin-oauth')
      return
    }
    user.set(data)
    mixinConnected.set(true)
    localStorage.setItem("mixin-oauth", token)
    getUserBalances(data.user_id, token)
    getUserSpotOrders(data.user_id)
    // getUserStrategyOrders(data.user_id)
  // }
}

export const MixinDisconnect = () => {
  user.set({})
  mixinConnected.set(false)
  localStorage.removeItem("mixin-oauth")
}

export const SpotPay = ({ exchange, symbol, limit, price, buy, amount, trace }: { exchange: string, symbol: string, limit: boolean, price: string, buy: boolean, amount: string, trace: string }) => {
  if (!exchange || !symbol || !amount || !trace) {
    console.error('Invalid input parameters');
    return;
  }
  if (!price) {
    price = '0'
  }
  const { firstAssetID, secondAssetID } = decodeSymbolToAssetID(symbol)
  if (!firstAssetID || !secondAssetID) {
    console.error('Failed to get asset id because invaild symbol submmited')
    return;
  }
  const memo = GenerateSpotTradingMemo({ limit, buy, symbol, price, exchange });
  if (buy) {
    return mixinPay({ asset_id: secondAssetID, amount, memo, trace_id: trace });
  }
  return mixinPay({ asset_id: firstAssetID, amount, memo, trace_id: trace });
}

export const ArbitrageCreatePay = ({
  action,
  amount,
  assetId,
  firstAssetId,
  secondAssetId,
  arbitragePairId,
  orderId,
  rewardAddress,
}: {
  action: string,
  amount: string,
  assetId: string,
  firstAssetId: string,
  secondAssetId: string,
  arbitragePairId: string,
  orderId: string,
  rewardAddress: string,
}) => {
  if (!rewardAddress || !amount || !orderId || !assetId || !arbitragePairId) {
    console.error('Invalid input parameters for ArbitragePay');
    return;
  }
  
  const mixinTraceId = getUuid();
  const memoParams = {
    version: 1,
    tradingType: 'Arbitrage',
    action,
    arbitragePairId,
    orderId,
    rewardAddress,
  }
  const memo = encodeArbitrageCreateMemo(memoParams);
  console.log(`ArbitragePay()=> memoParams: ${JSON.stringify(memoParams)}`)
  console.log(`ArbitragePay()=> memo: ${memo}`)
  if (!memo) {
    console.error('Failed to generate Arbitrage memo');
    return;
  }

  if (!firstAssetId || !secondAssetId) {
    console.error('Failed to get asset id for Arbitrage');
    return;
  }

  if (assetId != firstAssetId && assetId != secondAssetId) {
    console.error('Incorrect payment asset');
    return;
  }

  return mixinPay({
    asset_id: assetId,
    amount,
    memo,
    trace_id: mixinTraceId,
  });
};

export const MarketMakingCreatePay = ({
  action,
  exchange,
  symbol,
  assetId,
  firstAssetId,
  secondAssetId,
  marketMakingPairId,
  amount,
  orderId,
  rewardAddress,
}: {
  action: string,
  exchange: string,
  symbol: string,
  assetId: string,
  firstAssetId: string,
  secondAssetId: string,
  marketMakingPairId: string,
  amount: string,
  orderId: string,
  rewardAddress: string,
}) => {
  if (!exchange || !symbol || !amount || !orderId || !assetId || !marketMakingPairId || !rewardAddress) {
    console.error('Invalid input parameters for MarketMakingPay');
    return;
  }

  const mixinTraceId = getUuid();
  const memoParams = {
    version: 1,
    tradingType: 'Market Making',
    action,
    marketMakingPairId,
    orderId,
    rewardAddress,
  }
  const memo = encodeMarketMakingCreateMemo(memoParams);
  console.log(`MarketMakingPay()=> memoParams: ${JSON.stringify(memoParams)}`)
  console.log(`MarketMakingPay()=> memo: ${memo}`)
  if (!memo) {
    console.error('Failed to generate Market Making memo');
    return;
  }

  if (!firstAssetId || !secondAssetId) {
    console.error('Failed to get asset id for Market Making');
    return;
  }

  if (assetId != firstAssetId && assetId != secondAssetId) {
    console.error('Incorrect payment asset');
    return;
  }

  return mixinPay({
    asset_id: assetId,
    amount,
    memo,
    trace_id: mixinTraceId,
  });
};

export const SimplyGrowCreatePay = ({
  assetId,
  amount,
  orderId,
  rewardAddress,
}: {
  assetId: string,
  amount: string,
  orderId: string,
  rewardAddress: string,
}) => {
  if (!assetId || !amount || !orderId || !rewardAddress) {
    console.error('Invalid input parameters for SimplyGrowCreatePay');
    return;
  }
  const mixinTraceId = getUuid();
  const memoParams = {
    version: 1,
    tradingType: 'Simply Grow',
    action: 'create',
    orderId,
    rewardAddress,
  }
  const memo = encodeSimplyGrowCreateMemo(memoParams);
  console.log(`SimplyGrowCreatePay()=> memoParams: ${JSON.stringify(memoParams)}`)
  console.log(`SimplyGrowCreatePay()=> memo: ${memo}`)
  return mixinPay({
    asset_id: assetId,
    amount,
    memo,
    trace_id: mixinTraceId,
  });
}