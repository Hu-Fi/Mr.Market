<script lang="ts">
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="bg-base-100 rounded-xl p-4 text-base-content border border-base-300 hover:border-primary transition-colors cursor-pointer flex flex-col gap-4 shadow-sm"
  on:click={handleClick}
>
  <div class="flex justify-between items-start">
    <div class="flex items-center gap-3">
      <img
        src={symbolIcon}
        alt={campaign.symbol}
        class="w-10 h-10 rounded-full bg-base-300"
      />
      <div class="flex flex-col">
        <span class="font-semibold text-lg">{campaign.symbol}</span>
        <span class="text-sm text-base-content/70">{campaign.exchange}</span>
      </div>
    </div>
    <span class="badge badge-success text-success-content font-bold uppercase"
      >{campaign.status}</span
    >
  </div>

  <div class="flex items-center gap-2">
    <span class="badge badge-primary text-primary-content font-medium"
      >{campaign.type}</span
    >
  </div>

  <div class="grid grid-cols-2 gap-2 mt-2">
    <div class="bg-base-200 p-2 rounded-lg">
      <p class="text-[10px] text-base-content/60 uppercase">Total Funded</p>
      <p class="text-sm font-semibold text-primary">
        {campaign.totalFundedAmount || "0"}
      </p>
    </div>
    <div class="bg-base-200 p-2 rounded-lg">
      <p class="text-[10px] text-base-content/60 uppercase">Target</p>
      <p class="text-sm font-semibold text-primary">
        {campaign.targetValue || "0"}
      </p>
    </div>
  </div>
</div>
