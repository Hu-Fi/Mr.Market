<script lang="ts">
  import { goto } from "$app/navigation";
  import { page as dPage } from "$app/stores";
  import ChooseExchange from "$lib/components/grow/marketMaking/createNew/exchange/chooseExchange.svelte";
  import ChooseExchangeSmallBtn from "$lib/components/grow/marketMaking/createNew/exchange/chooseExchangeSmallBtn.svelte";
  import SearchExchange from "$lib/components/grow/marketMaking/createNew/exchange/searchBtn.svelte";
  import SearchTradingPair from "$lib/components/grow/marketMaking/createNew/tradingPair/searchTradingPair.svelte";
  import ChooseTradingPair from "$lib/components/grow/marketMaking/createNew/tradingPair/chooseTradingPair.svelte";
  import ChooseTradingPairSmallBtn from "$lib/components/grow/marketMaking/createNew/tradingPair/chooseTradingPairSmallBtn.svelte";
  import SearchExchangeDialog from "./searchExchangeDialog.svelte";
  import SearchTradingPairDialog from "./searchTradingPairDialog.svelte";
  import AmountText from "$lib/components/grow/marketMaking/createNew/amount/amountText.svelte";
  import AmountNextStepBtn from "$lib/components/grow/marketMaking/createNew/amount/amountNextStepBtn.svelte";
  import AmountInput from "$lib/components/grow/marketMaking/createNew/amount/amountInput.svelte";
  import ConfirmPaymentInfo from "$lib/components/grow/marketMaking/createNew/confirmation/confirmPaymentInfo.svelte";
  import ConfirmPaymentBtn from "$lib/components/grow/marketMaking/createNew/confirmation/confirmPaymentBtn.svelte";
  import emptyToken from "$lib/images/empty-token.svg";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import AmountTypeTab from "$lib/components/grow/marketMaking/createNew/amount/amountTypeTab.svelte";
  import Loading from "$lib/components/common/loading.svelte";

  import BigNumber from "bignumber.js";
  import { encodeMarketMakingCreateMemo } from "$lib/helpers/mixin/memo";
  import {
    createMixinInvoice,
    getPaymentUrl,
    type InvoiceItem,
  } from "$lib/helpers/mixin/mixin-invoice";
  import { v4 as uuidv4 } from "uuid";
  import { botId } from "$lib/stores/home";

  import type { GrowInfo } from "$lib/types/hufi/grow";

  export let data;

  let growInfo: GrowInfo | null = null;
  $: data.growBasicInfo.then((res: GrowInfo) => (growInfo = res));

  $: allMarketMakingPairs =
    growInfo?.market_making?.pairs?.filter((p) => p.enable) || [];
  $: selectedPairInfo = allMarketMakingPairs.find(
    (p) =>
      exchangeName &&
      tradingPair &&
      p.exchange_id === exchangeName &&
      p.symbol === tradingPair,
  );

  const selectExchange = (exchangeName: string) => {
    const newUrl = new URL($dPage.url);
    newUrl.searchParams.set("exchange", exchangeName);
    newUrl.searchParams.delete("trading_pair");
    newUrl.searchParams.delete("base_amount");
    newUrl.searchParams.delete("quote_amount");
    const newPath = newUrl.pathname + newUrl.search;
    goto(newPath, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };

  const selectTradingPair = (tradingPair: string) => {
    const newUrl = new URL($dPage.url);
    newUrl.searchParams.set("trading_pair", tradingPair);
    newUrl.searchParams.delete("base_amount");
    newUrl.searchParams.delete("quote_amount");
    const newPath = newUrl.pathname + newUrl.search;
    goto(newPath, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };

  const confirmPayment = () => {
    if (
      !selectedPairInfo ||
      !baseAmountInput ||
      !quoteAmountInput ||
      !baseAmount ||
      !quoteAmount
    ) {
      return;
    }

    const orderId = uuidv4();

    // Fee Config
    const feeAssetId = "4d8c508b-91c5-375b-92b0-ee7ca2a58710"; // USDT
    const feeAmount = "25";

    try {
      const memo = encodeMarketMakingCreateMemo({
        version: 1,
        tradingType: "Market Making",
        action: "create",
        marketMakingPairId: selectedPairInfo.id,
        orderId: orderId,
      });

      const items: InvoiceItem[] = [
        {
          assetId: selectedPairInfo.base_asset_id,
          amount: baseAmount,
          extra: memo,
        },
        {
          assetId: selectedPairInfo.target_asset_id,
          amount: quoteAmount,
        },
        {
          assetId: feeAssetId,
          amount: feeAmount,
        },
      ];

      const invoiceMin = createMixinInvoice($botId, items);
      if (invoiceMin) {
        const url = getPaymentUrl(invoiceMin);
        window.open(url);
      }
    } catch (e) {
      console.error("Error in confirmPayment:", e);
    }
  };

  $: exchangeName = $dPage.url.searchParams.get("exchange");
  $: tradingPair = $dPage.url.searchParams.get("trading_pair");
  $: baseAmount = $dPage.url.searchParams.get("base_amount");
  $: quoteAmount = $dPage.url.searchParams.get("quote_amount");
  $: baseSymbol = tradingPair ? tradingPair.split("/")[0] : null;
  $: quoteSymbol = tradingPair ? tradingPair.split("/")[1] : null;
  $: baseIcon = baseSymbol
    ? findCoinIconBySymbol(baseSymbol) || emptyToken
    : emptyToken;
  $: quoteIcon = quoteSymbol
    ? findCoinIconBySymbol(quoteSymbol) || emptyToken
    : emptyToken;

  let baseAmountInput = "";
  let quoteAmountInput = "";
  let lastTradingPair: string | null = null;
  let lastUrlBaseAmount: string | null = null;
  let lastUrlQuoteAmount: string | null = null;
  let amountMode: "both_token" | "single_token" = "both_token";
  let singleTokenType: "base" | "quote" = "base";

  $: showBase =
    amountMode === "both_token" ||
    (amountMode === "single_token" && singleTokenType === "base");
  $: showQuote =
    amountMode === "both_token" ||
    (amountMode === "single_token" && singleTokenType === "quote");

  $: isValidAmount =
    amountMode === "both_token"
      ? baseAmount && quoteAmount
      : amountMode === "single_token" && singleTokenType === "base"
        ? baseAmount
        : quoteAmount;

  $: if (tradingPair !== lastTradingPair) {
    baseAmountInput = "";
    quoteAmountInput = "";
    lastTradingPair = tradingPair;
  }

  $: if (baseAmount !== lastUrlBaseAmount) {
    baseAmountInput = baseAmount ?? "";
    lastUrlBaseAmount = baseAmount;
  }

  $: if (quoteAmount !== lastUrlQuoteAmount) {
    quoteAmountInput = quoteAmount ?? "";
    lastUrlQuoteAmount = quoteAmount;
  }
</script>

<!-- Step 1: Choose Exchange -->
{#await data.growBasicInfo}
  <div class="flex flex-col items-center justify-center grow h-[calc(90vh)]">
    <Loading />
  </div>
{:then growInfo}
  {@const allMarketMakingPairs =
    growInfo?.market_making?.pairs?.filter((p) => p.enable) || []}
  {@const supportedMarketMakingExchanges =
    growInfo?.market_making?.exchanges
      ?.filter((e) => e.enable)
      .map((e) => e.exchange_id) || []}
  {@const supportedTradingpairs = allMarketMakingPairs
    .filter((p) => !exchangeName || p.exchange_id === exchangeName)
    .map((p) => p.symbol)}
  {@const selectedPairInfo = allMarketMakingPairs.find(
    (p) => p.exchange_id === exchangeName && p.symbol === tradingPair,
  )}
  {@const basePrice = selectedPairInfo?.base_price
    ? parseFloat(selectedPairInfo.base_price)
    : 0}
  {@const quotePrice = selectedPairInfo?.target_price
    ? parseFloat(selectedPairInfo.target_price)
    : 0}
  {@const baseAmountUsd = baseAmount
    ? BigNumber(basePrice).times(baseAmount).toNumber()
    : null}
  {@const quoteAmountUsd = quoteAmount
    ? BigNumber(quotePrice).times(quoteAmount).toNumber()
    : null}

  {#if !exchangeName}
    <div class="flex flex-col items-center grow h-[calc(100vh-64px)] mt-[10vh]">
      <div class="text-center">
        <ChooseExchange />
      </div>
      <div
        class="mx-4 mt-12 pb-4 gap-6 grid grid-cols-2 bg-white
          bg-gradient-radial from-sky-100 via-white to-white
          max-h-[50vh] overflow-y-auto"
      >
        {#each supportedMarketMakingExchanges as exchangeName}
          <ChooseExchangeSmallBtn
            {exchangeName}
            onClick={() => selectExchange(exchangeName)}
          />
        {/each}
      </div>
    </div>

    <div class="absolute bottom-24 w-full flex justify-center space-x-2">
      <SearchExchange onSearch={() => {}} />
    </div>
    <SearchExchangeDialog
      supportedExchanges={supportedMarketMakingExchanges}
      onSelect={selectExchange}
    />

    <!-- Step 2: Choose Trading Pair -->
  {:else if !tradingPair}
    <div class="flex flex-col items-center grow h-[100vh-64px] mt-[10vh]">
      <div class="text-center">
        <ChooseTradingPair {exchangeName} />
      </div>
      <div
        class="mx-4 mt-12 gap-6 grid grid-cols-2 bg-white
      max-h-[50vh] overflow-y-auto"
      >
        {#each supportedTradingpairs as tradingPair}
          <ChooseTradingPairSmallBtn
            {tradingPair}
            {exchangeName}
            onClick={() => selectTradingPair(tradingPair)}
          />
        {/each}
      </div>
    </div>

    <div class="absolute bottom-24 w-full flex justify-center">
      <SearchTradingPair onSearch={() => {}} />
    </div>
    <SearchTradingPairDialog
      supportedTradingPairs={supportedTradingpairs}
      {exchangeName}
      onSelect={selectTradingPair}
    />

    <!-- Step 3: Enter Amount -->
  {:else if !isValidAmount}
    <div
      class="flex flex-col items-center grow h-[100vh-64px] mt-[10vh] space-y-4"
    >
      <div class="text-center">
        <AmountText {exchangeName} {tradingPair} />
      </div>
      <AmountTypeTab
        bind:mode={amountMode}
        bind:tokenType={singleTokenType}
        {baseSymbol}
        {quoteSymbol}
        {baseIcon}
        {quoteIcon}
      />
      <div
        class="mx-4 gap-6 grid grid-cols-1 bg-white
      max-h-[50vh] overflow-y-auto rounded-xl min-w-40"
      >
        <AmountInput
          {baseIcon}
          {quoteIcon}
          {baseSymbol}
          {quoteSymbol}
          {showBase}
          {showQuote}
          {basePrice}
          {quotePrice}
          bind:baseAmount={baseAmountInput}
          bind:quoteAmount={quoteAmountInput}
        />
      </div>
    </div>

    <div class="absolute bottom-24 w-full flex justify-center">
      <div class="w-full flex justify-center mt-4">
        <AmountNextStepBtn
          baseAmount={baseAmountInput}
          quoteAmount={quoteAmountInput}
          mode={amountMode}
          tokenType={singleTokenType}
        />
      </div>
    </div>
    <SearchTradingPairDialog
      supportedTradingPairs={supportedTradingpairs}
      {exchangeName}
      onSelect={selectTradingPair}
    />

    <!-- Step 4: Confirm Payment -->
  {:else}
    <div
      class="flex flex-col items-center grow h-[100vh-64px] mt-[10vh] px-4 space-y-4"
    >
      <ConfirmPaymentInfo
        {exchangeName}
        {tradingPair}
        {baseSymbol}
        {quoteSymbol}
        {baseIcon}
        {quoteIcon}
        {baseAmount}
        {quoteAmount}
        {baseAmountUsd}
        {quoteAmountUsd}
      />
      <div class="px-6 w-full flex justify-center">
        <ConfirmPaymentBtn onConfirm={confirmPayment} />
      </div>
    </div>
  {/if}
{/await}
