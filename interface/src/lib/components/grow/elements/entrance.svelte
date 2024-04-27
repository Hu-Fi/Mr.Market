<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  
  let items = [
    { name: $_("arbitrage"),     fn: () => goto('/grow/arbitrage') },
    { name: $_("market_making"), fn: () => goto('/grow/market_making') },
    // { name: $_("auto_invest"),   fn: () => goto('/grow/auto_invest') },
  ];
</script>

<!-- Tabs -->
<div class="mx-4 mt-2">
  <div class={clsx("w-full grid gap-2 rounded-2xl", `grid-cols-${items.length}`)}>
    {#each items as item, i}
      <button
        class={clsx(
          "items-center justify-between no-animation hover:bg-slate-50 focus:bg-slate-50 bg-slate-50 border border-slate-100 flex flex-col space-y-1.5 rounded-2xl py-5",
        )}
        on:click={() => {
          item.fn();
        }}
      >
        <div class={clsx("flex items-center justify-center rounded-full p-2.5 border", i === 0 && 'text-blue-600 border-blue-600', i === 1 && 'text-green-600 border-green-600')}>
          {#if i === 0}
            <!-- Arbitrage -->
            <svg class="w-5 h-5" data-testid="arbitrage" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 15.75C15.32 15.75 15.12 15.74 14.93 15.73C14.56 15.71 14.26 15.41 14.23 15.04C14.01 12.25 11.74 9.98999 8.95999 9.76999C8.58999 9.73999 8.28999 9.44001 8.26999 9.07001C8.25999 8.88001 8.25 8.69 8.25 8.5C8.25 4.5 11.5 1.25 15.5 1.25C19.5 1.25 22.75 4.5 22.75 8.5C22.75 12.5 19.5 15.75 15.5 15.75ZM9.75 8.35999C12.73 8.87999 15.12 11.27 15.64 14.25C18.75 14.17 21.25 11.63 21.25 8.5C21.25 5.33 18.67 2.75 15.5 2.75C12.38 2.75 9.83 5.24999 9.75 8.35999Z" fill="currentColor"/><path d="M8.5 22.75C4.5 22.75 1.25 19.5 1.25 15.5C1.25 11.5 4.5 8.25 8.5 8.25C8.68 8.25 8.88001 8.25999 9.07001 8.26999C12.6 8.54999 15.46 11.41 15.73 14.92C15.74 15.12 15.75 15.31 15.75 15.5C15.75 19.5 12.5 22.75 8.5 22.75ZM8.5 9.75C5.33 9.75 2.75 12.33 2.75 15.5C2.75 18.67 5.33 21.25 8.5 21.25C11.67 21.25 14.25 18.67 14.25 15.5C14.25 15.34 14.24 15.18 14.23 15.03C14.01 12.26 11.75 9.98999 8.95999 9.76999C8.81999 9.75999 8.66 9.75 8.5 9.75Z" fill="currentColor"/><path d="M3 7.34C2.77 7.34 2.54999 7.29999 2.32999 7.20999C1.66999 6.93999 1.25 6.3 1.25 5.59V3C1.25 2.04 2.04 1.25 3 1.25H5.59C6.3 1.25 6.92999 1.66999 7.20999 2.32999C7.47999 2.98999 7.32999 3.73999 6.82999 4.23999L4.23999 6.82999C3.89999 7.15999 3.46 7.34 3 7.34ZM3 2.75C2.86 2.75 2.75 2.86 2.75 3V5.59C2.75 5.74 2.84999 5.80001 2.89999 5.82001C2.95999 5.84001 3.07001 5.86999 3.17001 5.76999L5.76001 3.17999C5.86001 3.07999 5.84 2.97 5.81 2.91C5.78 2.85 5.71999 2.76001 5.57999 2.76001H3V2.75Z" fill="currentColor"/><path d="M20.9988 22.7501H18.4088C17.6988 22.7501 17.0689 22.3301 16.7889 21.6701C16.5189 21.0101 16.6689 20.2601 17.1689 19.7601L19.7589 17.1701C20.2589 16.6701 21.0089 16.5201 21.6689 16.7901C22.3289 17.0601 22.7488 17.7001 22.7488 18.4101V21.0001C22.7488 21.9601 21.9588 22.7501 20.9988 22.7501ZM20.9888 18.1601C20.9388 18.1601 20.8788 18.1801 20.8188 18.2401L18.2289 20.83C18.1289 20.93 18.1488 21.0401 18.1788 21.1001C18.2088 21.1601 18.2688 21.2501 18.4088 21.2501H20.9988C21.1388 21.2501 21.2488 21.1401 21.2488 21.0001V18.4101C21.2488 18.2601 21.1488 18.2001 21.0988 18.1801C21.0688 18.1701 21.0288 18.1601 20.9888 18.1601Z" fill="currentColor"/></svg>
    
          {:else if i === 1}
            <!-- Market making -->
            <svg class="w-5 h-5" data-testid="market-making" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="currentColor"><rect fill="none" height="24" width="24"></rect><path d="M2,19.99l7.5-7.51l4,4l7.09-7.97L22,9.92l-8.5,9.56l-4-4l-6,6.01L2,19.99z M3.5,15.49l6-6.01l4,4L22,3.92l-1.41-1.41 l-7.09,7.97l-4-4L2,13.99L3.5,15.49z"></path></svg>
    
          {:else if i === 2}
            <!-- Auto invest -->
            <svg class="w-5 h-5" data-testid="auto-invest" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M12,2A11,11,0,1,0,23,13,11,11,0,0,0,12,2Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,22ZM23.71,6.71a1,1,0,0,1-1.42,0l-5-5A1,1,0,0,1,18.71.29l5,5A1,1,0,0,1,23.71,6.71ZM1,7a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l5-5A1,1,0,0,1,6.71,1.71l-5,5A1,1,0,0,1,1,7Zm17,5a1,1,0,0,1,0,2H12a1,1,0,0,1-1-1V7a1,1,0,0,1,2,0v5Z"/></g></g><script xmlns=""/></svg>
          {/if}  
        </div>

        <span
          class={clsx(
            "font-semibold text-xs",
            i === 0 && 'text-blue-600', i === 1 && 'text-green-600',
          )}>{item.name}</span
        >
      </button>
    {/each}
  </div>
</div>