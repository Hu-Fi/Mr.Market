import { writable } from "svelte/store";
import { asks as a, bids as b, current as c, usdValue as u} from "$lib/helpers/temporary";
import { BN, formatDecimals } from "$lib/helpers/utils";

export let bottomTradeDialog = writable(false)
// 0 swap, 1 spot, 2 leverage, 3 perp, 4 market making
export let bottomMode = writable(1)

export let pair = writable({first: "BTC", second: "USDT", price: 43576, percentage: -0.87, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", exchange: "binance"})
export let pairSearch = writable("")
export let pairSelectorDialog = writable(false)
// 0 limit, 1 market, ...
export let orderType = writable({index: 0, name: "Limit order", fn: ()=>{}})
export let orderTypeDialog = writable(false)
export let orderConfirmDialog = writable(false)

export let buy = writable(true)
export let price = writable()
export let amount = writable()
export let total = writable()

export let asks = writable(a)
export let bids = writable(b)
export let current = writable(c)
export let usdValue = writable(u)

// 0 default, 1 ask, 2 bid
export let orderBookMode = writable(0)
export let orderBookDecimal = writable(1)
export let orderBookDecimalDialog = writable(false)

// 0 order, 1 position, ...
export let manageMode = writable(0)
// 0 default, 1 limit/market, 2 TP/SP, ...
export let orderFilterMode = writable(0)
// order filter
export let orderFilterDialog = writable(false)
export let cancelOrderDialog = writable(false)
export let cancelAllOrderDialog = writable(false)
export let cancelingOrder = writable()
export let currentPairOnly = writable(false)
export let openedOrders = writable(0)
export let openPositions = writable(0)
// history filter
export let historyFilterDialog = writable(false)
// 0 default, 1 limit/market, 2 TP/SP, ...
export let historyFilterMode = writable(0)

export const cancelOrder = (o: object) => {
  cancelingOrder.set(o)
  cancelOrderDialog.set(true)
}
export const cancelOrderDone = (o: object) => {
  cancelingOrder.set({})
  cancelOrderDialog.set(false)
}