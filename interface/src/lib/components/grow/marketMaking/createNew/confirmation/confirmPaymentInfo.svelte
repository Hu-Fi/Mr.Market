<script lang="ts">
  import { _ } from "svelte-i18n";
  import ExchangeIcon from "$lib/components/common/exchangeIcon.svelte";
  import ExchangeName from "$lib/components/common/exchangeName.svelte";
  import PairIcon from "$lib/components/common/tradingPairIcon.svelte";
  import emptyToken from "$lib/images/empty-token.svg";
  import ConfirmHeader from "./confirmHeader.svelte";
  import ConfirmSummaryCard from "./confirmSummaryCard.svelte";
  import ConfirmAmountTile from "./confirmAmountTile.svelte";

  export let exchangeName: string | null = null;
  export let tradingPair: string | null = null;
  export let baseSymbol: string | null = null;
  export let quoteSymbol: string | null = null;
  export let baseIcon: string = emptyToken;
  export let quoteIcon: string = emptyToken;
  export let baseAmount: string | null = null;
  export let quoteAmount: string | null = null;

  const formatAmount = (amount: string | null) => {
    if (!amount) return "0";
    const parsed = Number(amount);
    if (!Number.isFinite(parsed)) return amount;
    return parsed.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });
  };
</script>

<div class="w-full max-w-md space-y-6 rounded-3xl bg-base-100 p-6 shadow-lg">
  <ConfirmHeader
    label={$_("review_selection")}
    title={$_("confirm_payment")}
    description={$_("review_selection_intro")}
  />

  <div class="space-y-4">
    <ConfirmSummaryCard title={$_("exchange")}>
      <svelte:fragment slot="icon">
        <ExchangeIcon exchangeName={exchangeName ?? "binance"} clazz="w-10 h-10 rounded-full" />
      </svelte:fragment>
      <svelte:fragment slot="value">
        <ExchangeName exchangeName={exchangeName ?? ""} clazz="text-base font-semibold" />
      </svelte:fragment>
    </ConfirmSummaryCard>

    <ConfirmSummaryCard title={$_("trading_pair")}>
      <svelte:fragment slot="icon">
        <PairIcon
          clazz="w-10 h-10"
          claxx="w-3 h-3"
          asset0Icon={baseIcon || emptyToken}
          asset1Icon={quoteIcon || emptyToken}
        />
      </svelte:fragment>
      <svelte:fragment slot="value">
        {tradingPair ?? ""}
      </svelte:fragment>
    </ConfirmSummaryCard>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ConfirmAmountTile
        label={`${baseSymbol ?? ""} ${$_("amount")}`}
        amount={formatAmount(baseAmount)}
      />
      <ConfirmAmountTile
        label={`${quoteSymbol ?? ""} ${$_("amount")}`}
        amount={formatAmount(quoteAmount)}
      />
    </div>
  </div>
</div>

