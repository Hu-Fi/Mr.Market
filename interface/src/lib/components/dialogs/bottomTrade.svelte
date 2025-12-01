<script lang="ts">
  import clsx from "clsx";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { _, locale } from "svelte-i18n";
  import { langs } from "../../../i18n/i18n";
  import { isMixinIOS } from "$lib/stores/home";
  import { showSettingShortcut, toggleTheme } from "$lib/stores/theme";
  import { bottomModeLastRoute, bottomTradeDialog } from "$lib/stores/spot";

  const items = [
    {title: $_("spot"), route: '/spot'},
    // {title: $_("swap"), route: '/swap'},
    // {title: "Leverage", route: "/leverage"},
    // {title: "Perpetual", route: "/perpetual"},
  ]

  let toggleLanguage = false;
  let expanded = false;
  $: $bottomTradeDialog, expanded = false, toggleLanguage = false;
</script>

<dialog
  id="bottom_trade_modal"
  class="modal modal-bottom sm:modal-middle flex flex-col justify-end items-center"
  class:modal-open={$bottomTradeDialog}
>
  <form method="dialog" class="modal-backdrop h-[calc(100%-(56px+28px+16px+32px+274px))]">
    <button on:click={() => bottomTradeDialog.set(false)}></button>
  </form>
  <div class={clsx("modal-box space-y-3 py-4 pb-8 w-80 rounded-2xl shadow-sm clip-trade", $isMixinIOS ? "mb-14" : "mb-7")}>
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10">
      <!-- Routes -->
      {#if !toggleLanguage}
        {#each items as item}
          <button class="w-full flex justify-between py-3" on:click={()=>{goto(item.route); bottomModeLastRoute.set(item.route); bottomTradeDialog.set(false)}}>
            <span class="font-medium">
              {item.title}
            </span>
            {#if $page.url.pathname.includes(item.route)}
              <div>
                <!-- Circle check Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>          
              </div>
            {/if}
          </button>
        {/each}
      {:else}
      <!-- Languages -->
        <div class="h-[240px] overflow-y-auto">
          {#each Object.values(langs) as k}
            <button class="w-full flex justify-between py-3" on:click={()=>{locale.set(k.key)}}>
              <span class="font-medium">
                {k.name}
              </span>
              {#if k.key === $locale}
                <div>
                  <!-- Circle check Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>          
                </div>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Close Button -->
  <div class={clsx("relative flex items-center justify-between w-80", $isMixinIOS ? "bottom-[3.25rem]" : "bottom-6")}>
    <div class={clsx(expanded ? "w-[calc(32px*2+12px+20px)]" : "w-[52px]")}></div>
    
    <button class="btn rounded-full bg-base-100 hover:bg-base-100 no-animation h-[2.875rem] w-[2.875rem] min-h-[2.875rem] px-3" on:click={()=>bottomTradeDialog.set(false)}>
      <!-- Close Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
    </button>
    
    {#if $showSettingShortcut}
      <!-- Settings -->
      <div class="flex space-x-3 mr-5 mt-0">
        {#if expanded}
          <button class="btn btn-sm flex items-center justify-center rounded-full p-0 h-8 w-8" on:click={()=>{toggleLanguage = !toggleLanguage}}>
            {#if !toggleLanguage}
              <!-- Translate Icon -->
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" /></svg>            
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            {/if}
          </button>

          <button class="btn btn-sm flex items-center justify-center rounded-full p-0 h-8 w-8">
            <!-- Theme Switch Icon -->
            <label class="swap swap-rotate">
              <!-- this hidden checkbox controls the state -->
              <input type="checkbox" class="theme-controller"/>
              
              <!-- sun icon -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <svg on:click={()=>toggleTheme()} class="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
              
              <!-- moon icon -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <svg on:click={()=>toggleTheme()} class="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
            </label>
          </button>
        {:else}
          <button class="btn btn-sm flex items-center justify-center rounded-full p-0 h-8 w-8" on:click={()=>{expanded=true}}>
            <!-- Setting Icon -->
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>        
          </button>
        {/if}
      </div>
    {:else}
      <div class="mr-5 h-8 w-8"/>
    {/if}
  </div>
</dialog>

<style>
  .clip-trade {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 
      65% 100%, 
      60% 95%,
      50% 95%, 
      40% 95%,
      35% 100%, 
    0% 100%);
  }
</style>