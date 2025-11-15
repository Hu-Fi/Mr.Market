<script>
  import { _ } from "svelte-i18n";
  import ExchangeIcon from "$lib/components/common/exchangeIcon.svelte";
  import ExchangeName from "$lib/components/common/exchangeName.svelte";

  export let exchangeName = 'binance';
  export let onClick = () => {};
</script>

<button
  class="flex items-center justify-left px-4 py-2 space-x-4 
    bg-base-100 border border-slate-200 text-base-content 
    min-h-12 w-full no-animation rounded-xl"
  on:click={() => onClick()}
>
  <ExchangeIcon exchangeName={exchangeName} clazz="w-8 h-8 rounded-full" />
  <ExchangeName exchangeName={exchangeName} clazz="font-semibold text-sm" />
</button>
