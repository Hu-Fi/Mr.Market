<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { darkTheme } from "$lib/stores/theme";
  import { bottomModeLastRoute, bottomTradeDialog } from "$lib/stores/spot";
  
  $: active = $page.url.pathname.includes('/home') ? 0 : 
    $page.url.pathname.includes('/market') ? 1 : 
    $page.url.pathname.includes('/spot') ? 2 :
    $page.url.pathname.includes('/grow') ? 3 :
    $page.url.pathname.includes('/wallet') ? 4 : 2;
  $: routes = [
    {icon: 'home', route: '/home', title: $_('home')},
    {icon: 'market', route: '/market/token', title: $_('market')},
    {icon: 'trade', route: '/spot', title: $_('trade')},
    {icon: 'grow', route: '/grow', title: $_('grow')},
    {icon: 'wallet', route: '/wallet', title: $_('wallet')},
  ]
  const routing = (route: string) => {
    // If the destination route is '/spot'
    if (route === '/spot') {
      // Check if the current route is one of the trade-related routes
      const isTradeRelatedRoute = ['/swap', '/spot', '/leverage', '/perp'].includes($page.url.pathname);
      // Check if route is spot related
      const isSpotRelatedRoute = $page.url.pathname.startsWith('/spot')
      // If we're already on a trade-related route, open the dialog
      if (isTradeRelatedRoute || isSpotRelatedRoute) {
        bottomTradeDialog.set(true);
      } else {
        // If we're not on a trade-related route, go to the last trade mode or default to '/spot'
        if ($bottomModeLastRoute) {
          goto($bottomModeLastRoute);
        } else {
          goto('/spot');
          bottomModeLastRoute.set('/spot');
        }
      }
    } else {
      // If the destination route is not '/spot', just go to that route
      goto(route);
    }
  }
</script>

<div class={clsx("btm-nav btm-nav-xs h-[3.25rem] visible bg-base-100 shadow-[0_-1px_1px_black]", $darkTheme ? "shadow-zinc-800":"shadow-zinc-100")}>
  {#each routes as route, i}
    <button class={clsx("flex flex-col justify-start")} on:click={()=>routing(route.route)} data-testid={`bottom-nav-${route.icon}`}>
      <div class={clsx(active === i ? 'opacity-100 text-base-content' : i===2 ? '' : 'opacity-40', "mt-2")}>
        {#if route.icon === 'trade'}
          <!-- Trade -->
          <button class={clsx(active === i ? "trade-icon-active" : "trade-icon-inactive" ," relative bottom-7 trade-icon p-2.5 flex justify-center items-center bg-slate-800 rounded-full")}>
            <svg xmlns="http://www.w3.org/2000/svg"  class="w-6 h-6 fill-base-100 stroke-base-100" viewBox="0 0 24.00 24.00" stroke-width="0.24000000000000005" transform="rotate(90)matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.4800000000000001"><path d="M21.49 13.926l-3.273 2.48c.054-.663.116-1.435.143-2.275.04-.89.023-1.854-.043-2.835-.043-.487-.097-.98-.184-1.467-.077-.485-.196-.982-.31-1.39-.238-.862-.535-1.68-.9-2.35-.352-.673-.786-1.173-1.12-1.462-.172-.144-.31-.248-.414-.306l-.153-.093c-.083-.05-.187-.056-.275-.003-.13.08-.175.252-.1.388l.01.02s.11.198.258.54c.07.176.155.38.223.63.08.24.14.528.206.838.063.313.114.66.17 1.03l.15 1.188c.055.44.106.826.13 1.246.03.416.033.85.026 1.285.004.872-.063 1.76-.115 2.602-.062.853-.12 1.65-.172 2.335 0 .04-.004.073-.005.11l-.115-.118-2.996-3.028-1.6.454 5.566 6.66 6.394-5.803-1.503-.677z"></path><path d="M2.503 9.48L5.775 7c-.054.664-.116 1.435-.143 2.276-.04.89-.023 1.855.043 2.835.043.49.097.98.184 1.47.076.484.195.98.31 1.388.237.862.534 1.68.9 2.35.35.674.785 1.174 1.12 1.463.17.145.31.25.413.307.1.06.152.093.152.093.083.05.187.055.275.003.13-.08.175-.252.1-.388l-.01-.02s-.11-.2-.258-.54c-.07-.177-.155-.38-.223-.63-.082-.242-.14-.528-.207-.84-.064-.312-.115-.658-.172-1.027-.046-.378-.096-.777-.15-1.19-.053-.44-.104-.825-.128-1.246-.03-.415-.033-.85-.026-1.285-.004-.872.063-1.76.115-2.603.064-.853.122-1.65.174-2.334 0-.04.004-.074.005-.11l.114.118 2.996 3.027 1.6-.454L7.394 3 1 8.804l1.503.678z"></path></g><g id="SVGRepo_iconCarrier"><path d="M21.49 13.926l-3.273 2.48c.054-.663.116-1.435.143-2.275.04-.89.023-1.854-.043-2.835-.043-.487-.097-.98-.184-1.467-.077-.485-.196-.982-.31-1.39-.238-.862-.535-1.68-.9-2.35-.352-.673-.786-1.173-1.12-1.462-.172-.144-.31-.248-.414-.306l-.153-.093c-.083-.05-.187-.056-.275-.003-.13.08-.175.252-.1.388l.01.02s.11.198.258.54c.07.176.155.38.223.63.08.24.14.528.206.838.063.313.114.66.17 1.03l.15 1.188c.055.44.106.826.13 1.246.03.416.033.85.026 1.285.004.872-.063 1.76-.115 2.602-.062.853-.12 1.65-.172 2.335 0 .04-.004.073-.005.11l-.115-.118-2.996-3.028-1.6.454 5.566 6.66 6.394-5.803-1.503-.677z"></path><path d="M2.503 9.48L5.775 7c-.054.664-.116 1.435-.143 2.276-.04.89-.023 1.855.043 2.835.043.49.097.98.184 1.47.076.484.195.98.31 1.388.237.862.534 1.68.9 2.35.35.674.785 1.174 1.12 1.463.17.145.31.25.413.307.1.06.152.093.152.093.083.05.187.055.275.003.13-.08.175-.252.1-.388l-.01-.02s-.11-.2-.258-.54c-.07-.177-.155-.38-.223-.63-.082-.242-.14-.528-.207-.84-.064-.312-.115-.658-.172-1.027-.046-.378-.096-.777-.15-1.19-.053-.44-.104-.825-.128-1.246-.03-.415-.033-.85-.026-1.285-.004-.872.063-1.76.115-2.603.064-.853.122-1.65.174-2.334 0-.04.004-.074.005-.11l.114.118 2.996 3.027 1.6-.454L7.394 3 1 8.804l1.503.678z"></path></g></svg>
          </button>
        {:else if route.icon === 'home'}
          <!-- Home -->
          <svg xmlns="http://www.w3.org/2000/svg" class={clsx("w-5 h-5 fill-none", active === i && "fill-base-content")} viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
        {:else if route.icon === 'market'}
          <!-- Market -->
          <svg xmlns="http://www.w3.org/2000/svg" class={clsx("w-5 h-5 fill-none", active === i && "fill-base-content")} viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
        {:else if route.icon === 'grow'}
          <!-- Grow -->
          <svg xmlns="http://www.w3.org/2000/svg" class={clsx("w-5 h-5 fill-none", active === i && "fill-base-content")} viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        {:else if route.icon === 'wallet'}
          <!-- Wallet -->
          <svg xmlns="http://www.w3.org/2000/svg" class={clsx("w-5 h-5 fill-none", active === i && "fill-base-content")} viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" /></svg>
        {/if}
      </div>
      <span class={clsx("text-xs !text-[10px] absolute top-[30px]",active === i ? 'opacity-100 text-base-content' : 'opacity-40')}>{route.title}</span>
    </button>
  {/each}
</div>

<style>
  .trade-icon {
    opacity: 1;
  }
  .trade-icon-active {
    transform: rotate(0deg);
    transition: transform 0.1s;
  }
  .trade-icon-inactive {
    transform: rotate(-90deg);
    transition: transform 0.1s;
  }
</style>