<script lang="ts">
  import { _ } from "svelte-i18n";
  import { formatUSMoney } from "$lib/helpers/utils";
  import ExchangeIcon from "$lib/components/common/exchangeIcon.svelte";
  import ExchangeName from "$lib/components/common/exchangeName.svelte";
  import PairIcon from "$lib/components/common/tradingPairIcon.svelte";
  import emptyToken from "$lib/images/empty-token.svg";
  import ConfirmHeader from "./confirmHeader.svelte";
  import ConfirmSummaryCard from "./confirmSummaryCard.svelte";

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
  export let creationFeeAmount: string | number | null = null;
  export let creationFeeSymbol: string | null = null;

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
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return null;
    return formatUSMoney(numeric);
  };

  $: baseAmountUsdFormatted = formatFiat(baseAmountUsd);
  $: quoteAmountUsdFormatted = formatFiat(quoteAmountUsd);
</script>

<div class="w-full max-w-md space-y-6 rounded-3xl bg-base-100 p-6 pt-0">
  <ConfirmHeader
    title={$_("confirm_payment")}
    description={$_("review_selection_intro")}
  />

  <div class="space-y-6">
    <div class="grid grid-cols-2 gap-1 md:grid-cols-2">
      <ConfirmSummaryCard title={$_("exchange")}>
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

      <ConfirmSummaryCard title={$_("trading_pair")}>
        <svelte:fragment slot="icon">
          <PairIcon
            clazz="w-5 h-5"
            claxx="w-4 h-4"
            asset0Icon={baseIcon || emptyToken}
            asset1Icon={quoteIcon || emptyToken}
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <span>{tradingPair ?? ""}</span>
        </svelte:fragment>
      </ConfirmSummaryCard>
    </div>

    <div class="flex flex-col space-y-1">
      <ConfirmSummaryCard
        title={`${baseSymbol ?? ""} ${$_("amount")}`}
        valueClass="text-base-content"
      >
        <svelte:fragment slot="icon">
          <img
            src={baseIcon || emptyToken}
            alt={baseSymbol ?? ""}
            class="w-8 h-8 rounded-full object-cover"
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <div class="flex items-baseline gap-2 leading-tight">
            <span class="text-xl font-semibold text-base-content">
              {formatAmount(baseAmount)}
            </span>
            {#if baseAmountUsdFormatted}
              <span class="text-xs font-medium opacity-60">
                ({baseAmountUsdFormatted})
              </span>
            {/if}
          </div>
        </svelte:fragment>
      </ConfirmSummaryCard>

      <ConfirmSummaryCard
        title={`${quoteSymbol ?? ""} ${$_("amount")}`}
        valueClass="text-base-content"
      >
        <svelte:fragment slot="icon">
          <img
            src={quoteIcon || emptyToken}
            alt={quoteSymbol ?? ""}
            class="w-8 h-8 rounded-full object-cover"
          />
        </svelte:fragment>
        <svelte:fragment slot="value">
          <div class="flex items-baseline gap-2 leading-tight">
            <span class="text-xl font-semibold text-base-content">
              {formatAmount(quoteAmount)}
            </span>
            {#if quoteAmountUsdFormatted}
              <span class="text-xs font-medium opacity-60">
                ({quoteAmountUsdFormatted})
              </span>
            {/if}
          </div>
        </svelte:fragment>
      </ConfirmSummaryCard>

      <ConfirmSummaryCard
        title={$_("fee")}
        valueClass="text-xs font-semibold text-base-content"
      >
        <svelte:fragment slot="icon">
          <div
            class="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-xs font-semibold"
          >
            GAS
          </div>
        </svelte:fragment>
        <svelte:fragment slot="value">
          <div class="flex items-center gap-3">
            <span class="text-lg font-semibold text-base-content">
              {formatAmount(creationFeeAmount)}
              {creationFeeSymbol}
            </span>
            <button
              class="badge badge-xs p-1 rounded-full bg-base-300 text-base-content tooltip tooltip-bottom text-xs opacity-60"
              data-tip={$_("fee_usage_note")}
              type="button"
              aria-label={$_("fee_usage_note")}
            >
              <span class="text-xs"> ? </span>
            </button>
          </div>
        </svelte:fragment>
      </ConfirmSummaryCard>
    </div>
  </div>
</div>
