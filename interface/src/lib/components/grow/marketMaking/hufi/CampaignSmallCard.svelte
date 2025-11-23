<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import emptyToken from "$lib/images/empty-token.svg";

  export let campaign: any; // We'll type this properly if we knew the exact shape, using any for flexibility now

  // Helper to get icon if not present in campaign object directly
  $: symbolIcon =
    campaign.symbolIcon ||
    findCoinIconBySymbol(campaign.symbol?.split("/")[0]) ||
    emptyToken;

  const handleClick = () => {
    // Assuming campaign has an id field. If not, we might need to use address or something unique.
    // For now, let's assume 'id' or 'address' is available.
    const id = campaign.id || campaign.address;
    goto(`/market-making/hufi/campaign/${id}`);
  };
</script>

<button
  class="bg-slate-100 rounded-xl p-4 text-base-content border border-slate-200 hover:border-primary transition-colors cursor-pointer flex flex-col gap-4 text-left"
  on:click={handleClick}
>
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-3">
      <img
        src={symbolIcon}
        alt={campaign.symbol}
        class="w-10 h-10 rounded-full bg-base-300"
      />
      <div class="flex flex-col">
        <span class="font-semibold text-lg">{campaign.symbol}</span>
        <span class="text-sm text-base-content/60">{campaign.exchange}</span>
      </div>
    </div>
    <span
      class={clsx(
        "badge text-base-content font-medium",
        "badge-outline badge-neutral",
        // campaign.type === "Market Making" && "badge-primary",
        // campaign.type === "Threshold" && "badge-accent",
        // campaign.type === "Holding" && "badge-secondary",
      )}>{campaign.type}</span
    >
  </div>

  <div class="grid grid-cols-2 gap-2 mt-2">
    <div class="bg-base-100 p-4 py-3 rounded-xl">
      <p class="text-[10px] text-base-content/60 capitalize">
        {$_("total_funded")}
      </p>
      <p class="text-base font-semibold text-primary/80">
        {campaign.totalFundedAmount || "0"}
      </p>
    </div>
    <div class="bg-base-100 p-4 py-3 rounded-xl">
      <p class="text-[10px] text-base-content/60 capitalize">{$_("target")}</p>
      <p class="text-base font-semibold text-primary/80">
        {campaign.targetValue || "0"}
      </p>
    </div>
  </div>
</button>
