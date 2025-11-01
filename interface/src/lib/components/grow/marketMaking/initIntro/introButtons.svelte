<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { isFirstTimeMarketMaking } from "$lib/stores/market_making";
</script>

<div class="mx-8 flex flex-col space-y-4">
  <button class="btn bg-base-content text-base-100 w-full rounded-lg no-animation !rounded-full" on:click={
    () => {
      isFirstTimeMarketMaking.set(false);
    }
  }>
    {$_('start_market_making')}
  </button>

  <button class="btn bg-base-100 text-base-content w-full rounded-lg no-animation !rounded-full" 
    on:click={() => {
      goto('/market_making/learn_more');
    }}
    >
    {$_('learn_more')}
  </button>
</div>