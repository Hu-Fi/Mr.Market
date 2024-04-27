<script lang="ts">
  import clsx from "clsx";  
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { user } from "$lib/stores/wallet";
  import { darkTheme } from "$lib/stores/theme";
  import { mixinConnected } from "$lib/stores/home";
  import MixinMenu from "$lib/components/common/MixinMenu.svelte";

  let disableNews = false;
  let newsUpdated = false;
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]">
  <div class="flex items-center space-x-4 w-full px-4">
    <!-- User avatar -->
    <div class="avatar flex items-center justify-center">
      <div class="w-7 h-7 rounded-full flex items-center justify-center">
        {#if $mixinConnected && $user}
          <button on:click={()=>goto('/home/user')}>
            {#if $user.avatar_url}
              <img src={$user.avatar_url} alt="-"/>
            {:else}
              <div class="h-7 w-7 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="opacity-15">
                  <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                </svg>
              </div>    
            {/if}
          </button>
        {:else}
          <button class="w-7 h-7" on:click={()=>{goto('/home/user')}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="opacity-15">
              <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
            </svg>
          </button>
        {/if}
      </div>
    </div>

    <!-- Search placeholder -->
    <button class={clsx("flex items-center input input-sm text-xs outline-none border-0 rounded-full w-full focus:outline-none focus:border-0 space-x-1.5", $darkTheme ? "bg-slate-800":"bg-slate-100")} on:click={()=>{goto('/search')}} data-testid="home-search">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
      <span class="opacity-50"> {$_('search')} </span>
    </button>

    {#if !disableNews}
      <!-- News -->
      <button class="flex items-center" on:click={()=>{goto('/home/news')}} data-testid="home-news">
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 opacity-80">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
          </svg>
          
          {#if newsUpdated}
            <!-- Ping -->
            <div class="absolute top-0 right-0">
              <span class="relative flex h-1.5 w-1.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500"></span>
              </span>
            </div>
          {/if}
        </div>
      </button>
    {/if}
  </div>
  
  <div class="flex items-center space-x-4">
    <MixinMenu />
  </div>
</div>
