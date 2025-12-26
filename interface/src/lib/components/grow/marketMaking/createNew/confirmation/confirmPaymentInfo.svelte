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
      { total: string; breakdown: Array<{ type: string; amount: string }> }
    >();

    // Add base withdrawal fee
    if (
      baseFeeAmount &&
      parseFloat(String(baseFeeAmount)) > 0 &&
      baseFeeSymbol
    ) {
      const existing = fees.get(baseFeeSymbol);
      if (existing) {
        existing.total = BigNumber(existing.total)
          .plus(String(baseFeeAmount))
          .toString();
        existing.breakdown.push({
          type: $_("withdrawal_fee"),
          amount: String(baseFeeAmount),
        });
      } else {
        fees.set(baseFeeSymbol, {
          total: String(baseFeeAmount),
          breakdown: [
            { type: $_("withdrawal_fee"), amount: String(baseFeeAmount) },
          ],
        });
      }
    }

    // Add quote withdrawal fee
    if (
      quoteFeeAmount &&
      parseFloat(String(quoteFeeAmount)) > 0 &&
      quoteFeeSymbol
    ) {
      const existing = fees.get(quoteFeeSymbol);
      if (existing) {
        existing.total = BigNumber(existing.total)
          .plus(String(quoteFeeAmount))
          .toString();
        existing.breakdown.push({
          type: $_("withdrawal_fee"),
          amount: String(quoteFeeAmount),
        });
      } else {
        fees.set(quoteFeeSymbol, {
          total: String(quoteFeeAmount),
          breakdown: [
            { type: $_("withdrawal_fee"), amount: String(quoteFeeAmount) },
          ],
        });
      }
    }

    // Add base market making fee
    if (
      baseMarketMakingFee &&
      parseFloat(baseMarketMakingFee) > 0 &&
      baseSymbol
    ) {
      const existing = fees.get(baseSymbol);
      if (existing) {
        existing.total = BigNumber(existing.total)
          .plus(baseMarketMakingFee)
          .toString();
        existing.breakdown.push({
          type: $_("market_making_fee_with_pct", {
            values: {
              percent: (
                parseFloat(marketMakingFeePercentage || "0") * 100
              ).toFixed(2),
            },
          }),
          amount: baseMarketMakingFee,
        });
      } else {
        fees.set(baseSymbol, {
          total: baseMarketMakingFee,
          breakdown: [
            {
              type: $_("market_making_fee_with_pct", {
                values: {
                  percent: (
                    parseFloat(marketMakingFeePercentage || "0") * 100
                  ).toFixed(2),
                },
              }),
              amount: baseMarketMakingFee,
            },
          ],
        });
      }
    }

    // Add quote market making fee
    if (
      quoteMarketMakingFee &&
      parseFloat(quoteMarketMakingFee) > 0 &&
      quoteSymbol
    ) {
      const existing = fees.get(quoteSymbol);
      if (existing) {
        existing.total = BigNumber(existing.total)
          .plus(quoteMarketMakingFee)
          .toString();
        existing.breakdown.push({
          type: $_("market_making_fee_with_pct", {
            values: {
              percent: (
                parseFloat(marketMakingFeePercentage || "0") * 100
              ).toFixed(2),
            },
          }),
          amount: quoteMarketMakingFee,
        });
      } else {
        fees.set(quoteSymbol, {
          total: quoteMarketMakingFee,
          breakdown: [
            {
              type: $_("market_making_fee_with_pct", {
                values: {
                  percent: (
                    parseFloat(marketMakingFeePercentage || "0") * 100
                  ).toFixed(2),
                },
              }),
              amount: quoteMarketMakingFee,
            },
          ],
        });
      }
    }

    return fees;
  })();

  // Group fees for breakdown by Type
  $: withdrawalFees = [
    {
      amount: baseFeeAmount,
      symbol: baseFeeSymbol,
      type: $_("withdrawal_fee"),
    },
    {
      amount: quoteFeeAmount,
      symbol: quoteFeeSymbol,
      type: $_("withdrawal_fee"),
    },
  ].filter((f) => f.amount && parseFloat(String(f.amount)) > 0);

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
    },
  ].filter((f) => f.amount && parseFloat(String(f.amount)) > 0);

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

    console.log(
      `baseFeeAmount, baseFeeUsdPrice, quoteFeeAmount, quoteFeeUsdPrice:`,
      baseFeeAmount,
      baseFeeUsdPrice,
      quoteFeeAmount,
      quoteFeeUsdPrice,
    );
    // Add withdrawal fee USD values
    if (
      baseFeeAmount &&
      baseFeeUsdPrice &&
      parseFloat(String(baseFeeAmount)) > 0
    ) {
      total = total.plus(BigNumber(baseFeeAmount).times(baseFeeUsdPrice));
    }
    if (
      quoteFeeAmount &&
      quoteFeeUsdPrice &&
      parseFloat(String(quoteFeeAmount)) > 0
    ) {
      total = total.plus(BigNumber(quoteFeeAmount).times(quoteFeeUsdPrice));
    }

    // Add market making fee USD values
    if (
      baseMarketMakingFee &&
      baseAssetUsdPrice &&
      parseFloat(baseMarketMakingFee) > 0
    ) {
      total = total.plus(
        BigNumber(baseMarketMakingFee).times(baseAssetUsdPrice),
      );
    }
    if (
      quoteMarketMakingFee &&
      quoteAssetUsdPrice &&
      parseFloat(quoteMarketMakingFee) > 0
    ) {
      total = total.plus(
        BigNumber(quoteMarketMakingFee).times(quoteAssetUsdPrice),
      );
    }

    return total.isGreaterThan(0) ? total.toNumber() : null;
  })();

  $: totalFeeUsdFormatted = formatFiat(totalFeeUsd);
</script>

<div class="w-full max-w-md space-y-6 rounded-3xl bg-base-100 p-6 pt-0">
  <ConfirmHeader
    title={$_("confirm_payment")}
    description={$_("review_selection_intro")}
  />

  <div class="space-y-6">
    <div class="grid grid-rows-2 gap-0 md:grid-cols-2">
      <ConfirmSummaryCard title={$_("exchange")} cardType="exchange-info">
        <svelte:fragment slot="icon">
          <ExchangeIcon
            exchangeName={exchangeName ?? "binance"}
            clazz="w-8 h-8 rounded-full"
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <ExchangeName exchangeName={exchangeName ?? ""} />
        </svelte:fragment>
      </ConfirmSummaryCard>

      <ConfirmSummaryCard title={$_("trading_pair")} cardType="exchange-info">
        <svelte:fragment slot="icon">
          <PairIcon
            clazz="w-4 h-4"
            claxx="w-2 h-2"
            asset0Icon={baseIcon || emptyToken}
            asset1Icon={quoteIcon || emptyToken}
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <span>{tradingPair ?? ""}</span>
        </svelte:fragment>
      </ConfirmSummaryCard>
    </div>

    <div class="flex flex-col space-y-0 text-base-content leading-tight">
      <ConfirmSummaryCard title={`${baseSymbol ?? ""} ${$_("amount")}`}>
        <svelte:fragment slot="icon">
          <img
            src={baseIcon || emptyToken}
            alt={baseSymbol ?? ""}
            class="w-8 h-8 rounded-full object-cover"
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <div class="flex flex-col items-start gap-1 leading-tight">
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-semibold text-base-content">
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
            class="w-8 h-8 rounded-full object-cover"
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <div class="flex flex-col items-start gap-1 leading-tight">
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-semibold text-base-content">
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

      <div class="">
        <ConfirmSummaryCard title={$_("fee")}>
          <svelte:fragment slot="icon">
            <div
              class="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-xs font-semibold"
            >
              {$_("fee")}
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
                    <div class="px-0.5">
                      <span
                        class="text-xs font-semibold text-base-content opacity-80"
                      >
                        {formatAmount(feeData.total)}
                        {symbol}
                      </span>
                    </div>
                  {/each}
                </div>

                <!-- Info icon to show breakdown -->
                {#if withdrawalFees.length > 0 || marketMakingFees.length > 0}
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle"
                    on:click={() => (showFeeBreakdown = true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="w-4 h-4 opacity-60"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
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
</div>

<!-- Fee Breakdown Dialog -->
<dialog class="modal" class:modal-open={showFeeBreakdown}>
  <div class="modal-box">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">{$_("fee_breakdown")}</h3>
      <button
        type="button"
        class="btn btn-ghost btn-sm btn-circle"
        on:click={() => (showFeeBreakdown = false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
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
        <div class="space-y-3 text-left">
          <div class="text-xs font-bold capitalize tracking-wider opacity-60">
            {$_("withdrawal_fees")}
          </div>
          <div class="bg-base-200/50 rounded-xl overflow-hidden">
            {#each withdrawalFees as fee}
              <div
                class="flex justify-between items-center px-4 py-3 border-b border-base-300 last:border-0"
              >
                <span class="text-sm">{$_("network_fee")}</span>
                <span class="font-mono text-sm font-semibold">
                  {formatAmount(fee.amount)}
                  {fee.symbol}
                </span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Market Making Fee Section -->
      {#if marketMakingFees.length > 0}
        <div class="space-y-3 text-left">
          <div class="text-xs font-bold capitalize tracking-wider opacity-60">
            {$_("market_making_fees")}
          </div>
          <div class="bg-base-200/60 rounded-xl overflow-hidden">
            {#each marketMakingFees as fee}
              <div
                class="flex flex-col gap-1 px-4 py-3 border-b border-base-300 last:border-0"
              >
                <div class="flex justify-between items-center">
                  <span class="text-sm">{$_("strategy_fee")}</span>
                  <span class="font-mono text-sm font-semibold">
                    {formatAmount(fee.amount)}
                    {fee.symbol}
                  </span>
                </div>
                <span
                  class="text-[10px] opacity-50 capitalize font-bold tracking-tight"
                >
                  {fee.type}
                </span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Total USD Section -->
      {#if totalFeeUsdFormatted}
        <div class="space-y-3 text-left pt-2">
          <div class="border-t border-base-300 pt-4">
            <div
              class="flex justify-between items-center px-4 py-3 bg-base-200/60 rounded-xl"
            >
              <span class="text-sm font-semibold">{$_("total_fee_usd")}</span>
              <span class="font-mono text-sm font-semibold text-base-content">
                {totalFeeUsdFormatted}
              </span>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="modal-action">
      <button class="btn btn-block" on:click={() => (showFeeBreakdown = false)}>
        {$_("close")}
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop bg-black/40 backdrop-blur-sm">
    <button on:click={() => (showFeeBreakdown = false)}>close</button>
  </form>
</dialog>
