import { page } from "$app/stores";
import type { Socket } from "socket.io-client";
import { getOrderById } from "$lib/helpers/mrm/spot";
import { derived, writable, type Writable } from "svelte/store";
import { ORDER_STATE_TIMEOUT_DURATION } from "$lib/helpers/constants";
import type { OrderBookPriceFormat, PairsData } from "$lib/types/hufi/exchanges";

export const bottomTradeDialog = writable(false)
export const bottomModeLastRoute = writable('')

export const socket = writable<Socket>()
export const pair = writable<PairsData>({
  symbol: 'BTC/USDT',
  price: 0,
  exchange: 'okx',
})
export const pairSearch = writable("")
export const pairSelectorDialog = writable(false)
export const pairSelectorLoaded = writable(false)
export const pairExchangeFilter = writable("all")
// 0 limit, 1 market, ...
export const orderType = writable({ index: 0, name: "Limit order" })
export const orderTypeLimit = derived(orderType, ($orderType) => { return $orderType.index === 0 })
export const orderTypeMarket = derived(orderType, ($orderType) => { return $orderType.index === 1 })
export const orderTypeDialog = writable(false)
export const orderConfirmDialog = writable(false)

export const buy = writable(true)
export const limitPrice: Writable<number | string> = writable()
export const limitAmount: Writable<number | string> = writable()
export const limitTotal: Writable<number | string> = writable()
export const marketPrice: Writable<number | string> = writable()
export const marketAmount: Writable<number | string> = writable()
export const marketTotal: Writable<number | string> = writable()

export const asks = writable<OrderBookPriceFormat[]>()
export const bids = writable<OrderBookPriceFormat[]>()
export const current: Writable<number | string> = writable()
export const usdValue: Writable<number | string> = writable()

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
export const cancelingOrder = writable()
export const currentPairOnly = writable(false)
export const openedOrders = writable(0)
// history filter
export const historyFilterDialog = writable(false)
// 0 default, 1 limit/market, 2 TP/SP, ...
export const historyFilterMode = writable(0)

export const cancelOrder = (o: object) => {
  cancelingOrder.set(o)
  cancelOrderDialog.set(true)
}
export const cancelOrderDone = (o: object) => {
  console.log(o)
  cancelingOrder.set({})
  cancelOrderDialog.set(false)
}
export const spotCreating = writable(false);
export const orderDetailsStatus = writable('loading');
export const orderDetails = derived(
  page,
  ($page, set) => {
    const handleSuccess = (params: unknown) => {
      set(params);
      orderDetailsStatus.set('success');
    }
    const handleError = () => {
      orderDetailsStatus.set('error');
    }
    const interval = setInterval(() => {
      if ($page.data.orderId) {
        getOrderById($page.data.orderId).then(handleSuccess).catch(handleError);
      }
    }, ORDER_STATE_TIMEOUT_DURATION);

    return () => {
      clearInterval(interval);
    };
  },
);