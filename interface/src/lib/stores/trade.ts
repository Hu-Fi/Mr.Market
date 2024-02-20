import { writable } from "svelte/store";
import type { Socket } from "socket.io-client";
import { asks as a, bids as b, current as c, usdValue as u} from "$lib/helpers/temporary";
import type { OrderBookPriceFormat } from "$lib/types/hufi/exchanges";

export const bottomTradeDialog = writable(false)
export const bottomModeLastRoute = writable('')

export const socket = writable<Socket>()
export const pair = writable({first: "BTC", second: "USDT", price: 43576, percentage: -0.87, exchange: "binance"})
export const pairSearch = writable("")
export const pairSelectorDialog = writable(false)
export const pairSelectorLoaded = writable(false)
export const pairExchangeFilter = writable("all")
// 0 limit, 1 market, ...
export const orderType = writable({index: 0, name: "Limit order", fn: ()=>{}})
export const orderTypeDialog = writable(false)
export const orderConfirmDialog = writable(false)

export const buy = writable(true)
export const price = writable()
export const amount = writable()
export const total = writable()

export const asks = writable<OrderBookPriceFormat[]>(a)
export const bids = writable<OrderBookPriceFormat[]>(b)
export const current = writable(c)
export const usdValue = writable(u)

// 0 default, 1 ask, 2 bid
export const orderBookMode = writable(0)
export const orderBookLoaded = writable(false)
export const orderBookModeDialog = writable(false)

// 0 order, 1 position, ...
export const manageMode = writable(0)
// 0 default, 1 limit/market, 2 TP/SP, ...
export const orderFilterMode = writable(0)
// order filter
export const orderFilterDialog = writable(false)
export const cancelOrderDialog = writable(false)
export const cancelAllOrderDialog = writable(false)
export const cancelingOrder = writable()
export const currentPairOnly = writable(false)
export const openedOrders = writable(0)
export const openPositions = writable(0)
// history filter
export const historyFilterDialog = writable(false)
// 0 default, 1 limit/market, 2 TP/SP, ...
export const historyFilterMode = writable(0)

export const cancelOrder = (o: object) => {
  cancelingOrder.set(o)
  cancelOrderDialog.set(true)
}
export const cancelOrderDone = (o: object) => {
  cancelingOrder.set({})
  cancelOrderDialog.set(false)
}