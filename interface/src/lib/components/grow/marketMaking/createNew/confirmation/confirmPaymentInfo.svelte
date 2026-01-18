<script lang="ts">
  import { _ } from "svelte-i18n";
  import { formatDecimals, formatUSMoney } from "$lib/helpers/utils";
  import ExchangeIcon from "$lib/components/common/exchangeIcon.svelte";
  import ExchangeName from "$lib/components/common/exchangeName.svelte";
  import PairIcon from "$lib/components/common/tradingPairIcon.svelte";
  import emptyToken from "$lib/images/empty-token.svg";
  import ConfirmHeader from "./confirmHeader.svelte";
  import ConfirmSummaryCard from "./confirmSummaryCard.svelte";
  import BigNumber from "bignumber.js";

  export let exchangeName: string | null = null;
  export let tradingPair: string | null = null;
  export let baseSymbol: string | null = null;
  export let quoteSymbol: string | null = null;
  export let baseIcon: string = emptyToken;
  export let quoteIcon: string = emptyToken;
  export let baseAmount: string | number | null = null;
  export let quoteAmount: string | number | null = null;
  export let baseAmountUsd: string | number | null = null;
  export let quoteAmountUsd: string | number | null = null;
  export let baseFeeAmount: string | number | null = null;
  export let baseFeeSymbol: string | null = null;
  export let quoteFeeAmount: string | number | null = null;
  export let quoteFeeSymbol: string | null = null;
  export let baseFeeUsdPrice: string | number | null = null;
  export let quoteFeeUsdPrice: string | number | null = null;
  export let baseAssetUsdPrice: string | number | null = null;
  export let quoteAssetUsdPrice: string | number | null = null;
  export let marketMakingFeePercentage: string | null = null;
  export let isFetchingFee: boolean = false;

  // Calculate market making fees based on percentage
  $: baseMarketMakingFee =
    baseAmount && marketMakingFeePercentage
      ? BigNumber(baseAmount).multipliedBy(marketMakingFeePercentage).toString()
      : null;

  $: quoteMarketMakingFee =
    quoteAmount && marketMakingFeePercentage
      ? BigNumber(quoteAmount)
          .multipliedBy(marketMakingFeePercentage)
          .toString()
      : null;

  // Group fees by asset and calculate totals for the summary view
  $: feesByAsset = (() => {
    const fees = new Map<
      string,
      {
        total: string;
        totalUsd: BigNumber;
        totalUsdFormatted: string | null;
        breakdown: Array<{ type: string; amount: string }>;
      }
    >();

    const addFee = (
      symbol: string,
      amount: string,
      usdPrice: string | number | null,
      type: string,
    ) => {
      const usdValue =
        usdPrice && !isNaN(parseFloat(String(usdPrice)))
          ? BigNumber(amount).times(usdPrice)
          : BigNumber(0);

      const existing = fees.get(symbol);
      if (existing) {
        existing.total = BigNumber(existing.total).plus(amount).toString();
        existing.totalUsd = existing.totalUsd.plus(usdValue);
        existing.totalUsdFormatted = formatFiat(existing.totalUsd.toNumber());
        existing.breakdown.push({ type, amount });
      } else {
        fees.set(symbol, {
          total: amount,
          totalUsd: usdValue,
          totalUsdFormatted: formatFiat(usdValue.toNumber()),
          breakdown: [{ type, amount }],
        });
      }
    };

    // Add base withdrawal fee
    if (
      baseFeeAmount &&
      parseFloat(String(baseFeeAmount)) > 0 &&
      baseFeeSymbol
    ) {
      addFee(
        baseFeeSymbol,
        String(baseFeeAmount),
        baseFeeUsdPrice,
        $_("withdrawal_fee"),
      );
    }

    // Add quote withdrawal fee
    if (
      quoteFeeAmount &&
      parseFloat(String(quoteFeeAmount)) > 0 &&
      quoteFeeSymbol
    ) {
      addFee(
        quoteFeeSymbol,
        String(quoteFeeAmount),
        quoteFeeUsdPrice,
        $_("withdrawal_fee"),
      );
    }

    // Add base market making fee
    if (
      baseMarketMakingFee &&
      parseFloat(baseMarketMakingFee) > 0 &&
      baseSymbol
    ) {
      const mmFeePct = (
        parseFloat(marketMakingFeePercentage || "0") * 100
      ).toFixed(2);
      addFee(
        baseSymbol,
        baseMarketMakingFee,
        baseAssetUsdPrice,
        $_("market_making_fee_with_pct", { values: { percent: mmFeePct } }),
      );
    }

    // Add quote market making fee
    if (
      quoteMarketMakingFee &&
      parseFloat(quoteMarketMakingFee) > 0 &&
      quoteSymbol
    ) {
      const mmFeePct = (
        parseFloat(marketMakingFeePercentage || "0") * 100
      ).toFixed(2);
      addFee(
        quoteSymbol,
        quoteMarketMakingFee,
        quoteAssetUsdPrice,
        $_("market_making_fee_with_pct", { values: { percent: mmFeePct } }),
      );
    }

    return fees;
  })();

  // Group fees for breakdown by Type
  $: withdrawalFees = [
    {
      amount: baseFeeAmount,
      symbol: baseFeeSymbol,
      type: $_("withdrawal_fee"),
      usdPrice: baseFeeUsdPrice,
    },
    {
      amount: quoteFeeAmount,
      symbol: quoteFeeSymbol,
      type: $_("withdrawal_fee"),
      usdPrice: quoteFeeUsdPrice,
    },
  ]
    .filter((f) => f.amount && parseFloat(String(f.amount)) > 0)
    .map((f) => {
      let usdAmount: string | null = null;
      if (f.amount && f.usdPrice) {
        const val = BigNumber(f.amount).times(f.usdPrice);
        if (!val.isNaN()) {
          usdAmount = val.toString();
        }
      }
      return { ...f, usdAmount };
    });

  $: marketMakingFees = [
    {
      amount: baseMarketMakingFee,
      symbol: baseSymbol,
      type: $_("market_making_fee_with_pct", {
        values: {
          percent: (parseFloat(marketMakingFeePercentage || "0") * 100).toFixed(
            2,
          ),
        },
      }),
      usdPrice: baseAssetUsdPrice,
    },
    {
      amount: quoteMarketMakingFee,
      symbol: quoteSymbol,
      type: $_("market_making_fee_with_pct", {
        values: {
          percent: (parseFloat(marketMakingFeePercentage || "0") * 100).toFixed(
            2,
          ),
        },
      }),
      usdPrice: quoteAssetUsdPrice,
    },
  ]
    .filter((f) => f.amount && parseFloat(String(f.amount)) > 0)
    .map((f) => {
      let usdAmount: string | null = null;
      if (f.amount && f.usdPrice) {
        const val = BigNumber(f.amount).times(f.usdPrice);
        if (!val.isNaN()) {
          usdAmount = val.toString();
        }
      }
      return { ...f, usdAmount };
    });

  let showFeeBreakdown = false;

  const formatAmount = (amount: string | number | null) => {
    if (amount === null || amount === undefined || amount === "") return "0";
    const parsed = Number(amount);
    if (!Number.isFinite(parsed)) return `${amount}`;
    return parsed.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });
  };

  const formatFiat = (value: string | number | null) => {
    if (value === null || value === undefined || value === "") return null;
    const numeric = formatDecimals(value, 2);
    return formatUSMoney(numeric);
  };

  $: baseAmountUsdFormatted = formatFiat(baseAmountUsd);
  $: quoteAmountUsdFormatted = formatFiat(quoteAmountUsd);

  // Calculate total fee in USD
  $: totalFeeUsd = (() => {
    let total = new BigNumber(0);
    for (const data of feesByAsset.values()) {
      total = total.plus(data.totalUsd);
    }
    return total.isGreaterThan(0) ? total.toNumber() : null;
  })();

  $: totalFeeUsdFormatted = formatFiat(totalFeeUsd);
</script>

<div class="w-full max-w-md space-y-8 p-6 pt-0">
  <ConfirmHeader
    title={$_("confirm_payment")}
    description={$_("review_selection_intro")}
  />

  <div class="space-y-6">
    <div class="grid grid-rows-2 gap-0">
      <ConfirmSummaryCard title={$_("exchange")}>
        <svelte:fragment slot="icon">
          <ExchangeIcon
            exchangeName={exchangeName ?? "binance"}
            clazz="w-9 h-9 rounded-full"
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <ExchangeName exchangeName={exchangeName ?? ""} />
        </svelte:fragment>
      </ConfirmSummaryCard>

      <ConfirmSummaryCard title={$_("trading_pair")}>
        <svelte:fragment slot="icon">
          <PairIcon
            clazz="w-5 h-5"
            claxx="w-2.5 h-2.5"
            asset0Icon={baseIcon || emptyToken}
            asset1Icon={quoteIcon || emptyToken}
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <span class="capitalize">{tradingPair ?? ""}</span>
        </svelte:fragment>
      </ConfirmSummaryCard>
    </div>

    <div class="flex flex-col space-y-0 text-base-content leading-tight">
      <ConfirmSummaryCard title={`${baseSymbol ?? ""} ${$_("amount")}`}>
        <svelte:fragment slot="icon">
          <img
            src={baseIcon || emptyToken}
            alt={baseSymbol ?? ""}
            class="w-9 h-9 rounded-full object-cover"
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <div class="flex flex-col items-start gap-1 leading-tight">
            <div class="flex items-baseline gap-2">
              <span class="font-bold text-base-content">
                {formatAmount(baseAmount)}
              </span>
              {#if baseAmountUsdFormatted}
                <span class="text-xs font-medium opacity-60">
                  ({baseAmountUsdFormatted})
                </span>
              {/if}
            </div>
          </div>
        </svelte:fragment>
      </ConfirmSummaryCard>

      <ConfirmSummaryCard title={`${quoteSymbol ?? ""} ${$_("amount")}`}>
        <svelte:fragment slot="icon">
          <img
            src={quoteIcon || emptyToken}
            alt={quoteSymbol ?? ""}
            class="w-9 h-9 rounded-full object-cover"
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <div class="flex flex-col items-start gap-1 leading-tight">
            <div class="flex items-baseline gap-2">
              <span class="font-bold text-base-content">
                {formatAmount(quoteAmount)}
              </span>
              {#if quoteAmountUsdFormatted}
                <span class="text-xs font-medium opacity-60">
                  ({quoteAmountUsdFormatted})
                </span>
              {/if}
            </div>
          </div>
        </svelte:fragment>
      </ConfirmSummaryCard>
    </div>

    <div class="">
      <ConfirmSummaryCard title={$_("fee")}>
        <svelte:fragment slot="icon">
          <div
            class="w-9 h-9 rounded-full bg-base-200 flex items-center justify-center text-xs font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5 opacity-50"
            >
              <path
                fill-rule="evenodd"
                d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </svelte:fragment>
        <svelte:fragment slot="value">
          {#if isFetchingFee}
            <div class="flex flex-col gap-1">
              <div class="skeleton h-3 w-24 bg-base-200"></div>
              <div class="skeleton h-3 w-24 bg-base-200"></div>
            </div>
          {:else}
            <div class="flex items-center gap-2">
              <div class="flex flex-col items-start gap-1">
                {#each Array.from(feesByAsset.entries()) as [symbol, feeData]}
                  <div class="px-0">
                    <div class="flex items-baseline gap-2">
                      <span class="text-[13px] font-bold text-base-content">
                        {formatAmount(feeData.total)}
                        {symbol}
                      </span>
                      {#if feeData.totalUsdFormatted}
                        <span class="text-xs font-medium opacity-60">
                          ({feeData.totalUsdFormatted})
                        </span>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>

              <!-- Info icon to show breakdown -->
              {#if withdrawalFees.length > 0 || marketMakingFees.length > 0}
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-circle -mr-2"
                  on:click={() => (showFeeBreakdown = true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-4 h-4 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              {/if}
            </div>
          {/if}
        </svelte:fragment>
      </ConfirmSummaryCard>
    </div>
  </div>
</div>

<!-- Fee Breakdown Dialog -->
<dialog class="modal modal-bottom" class:modal-open={showFeeBreakdown}>
  <div class="modal-box bg-base-100 rounded-t-3xl p-6 w-full relative">
    <!-- Handle for mobile feel -->
    <div
      class="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-base-300 rounded-full"
    ></div>

    <div class="flex items-center justify-between mb-6 mt-2">
      <span class="text-xl font-bold text-base-content"
        >{$_("fee_breakdown")}</span
      >
      <button
        type="button"
        class="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
        on:click={() => (showFeeBreakdown = false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-5 h-5 opacity-40"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="space-y-6">
      <!-- Withdrawal Fee Section -->
      {#if withdrawalFees.length > 0}
        <div class="space-y-2 text-left">
          <div class="text-[13px] font-bold text-base-content/40 pl-1">
            {$_("withdrawal_fees")}
          </div>
          <div
            class="border border-base-300 rounded-2xl overflow-hidden bg-base-100"
          >
            {#each withdrawalFees as fee}
              <div
                class="flex justify-between items-center px-5 py-4 border-b border-base-100 last:border-0"
              >
                <span class="text-sm font-medium text-base-content/70"
                  >{$_("network_fee")}</span
                >
                <div class="flex flex-col items-end">
                  <span class="text-sm font-bold text-base-content">
                    {formatAmount(fee.amount)}
                    {fee.symbol}
                  </span>
                  {#if formatFiat(fee.usdAmount)}
                    <span class="text-xs font-medium text-base-content/60">
                      ≈ {formatFiat(fee.usdAmount)}
                    </span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Market Making Fee Section -->
      {#if marketMakingFees.length > 0}
        <div class="space-y-2 text-left">
          <div class="text-[13px] font-bold text-base-content/40 pl-1">
            {$_("market_making_fees")}
          </div>
          <div
            class="border border-base-300 rounded-2xl overflow-hidden bg-base-100"
          >
            {#each marketMakingFees as fee}
              <div
                class="flex flex-col gap-1 px-5 py-4 border-b border-base-100 last:border-0"
              >
                <div class="flex justify-between items-start">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-base-content/70"
                      >{$_("strategy_fee")}</span
                    >
                    <span class="text-xs text-base-content/40 font-medium">
                      {fee.type}
                    </span>
                  </div>
                  <div class="flex flex-col items-end">
                    <span class="text-sm font-bold text-base-content">
                      {formatAmount(fee.amount)}
                      {fee.symbol}
                    </span>
                    {#if formatFiat(fee.usdAmount)}
                      <span class="text-xs font-medium text-base-content/60">
                        ≈ {formatFiat(fee.usdAmount)}
                      </span>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Total USD Section -->
      {#if totalFeeUsdFormatted}
        <div class="pt-2">
          <div
            class="flex justify-between items-center px-5 py-5 bg-slate-50 rounded-2xl"
          >
            <span class="text-sm font-bold text-base-content"
              >{$_("total_fee_usd")}</span
            >
            <span class="text-lg font-bold text-base-content">
              {totalFeeUsdFormatted}
            </span>
          </div>
        </div>
      {/if}
    </div>

    <div class="mt-8">
      <button
        class="btn btn-block bg-base-content text-base-100 hover:bg-base-content/90 rounded-full h-12 min-h-12 border-none text-sm font-bold"
        on:click={() => (showFeeBreakdown = false)}
      >
        {$_("close")}
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop bg-black/20 backdrop-blur-sm">
    <button on:click={() => (showFeeBreakdown = false)}>close</button>
  </form>
</dialog>
