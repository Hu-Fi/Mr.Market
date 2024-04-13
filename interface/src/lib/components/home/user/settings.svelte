<script lang="ts">
  import { _, locale } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { mixinConnected } from "$lib/stores/home";
  import { toggleTheme } from "$lib/stores/theme";
  import { getNameByKey } from "../../../../i18n/i18n";
  import { MixinDisconnect } from "$lib/helpers/mixin";

  const items = [
    {key: 'lang', name: $_('language'), value: getNameByKey($locale || 'en-US'), fn: ()=>{goto('/home/user/i18n')}},
    // {key: 'theme', name: $_('theme'), value: 0, fn: ()=>{}},
    {key: 'quotation', name: $_('quotation'), value: 0, fn: ()=>{}},
    {key: 'faq', name: $_('faq'), value: 0, fn: ()=>{}},
    {key: 'us', name: $_('about_us'), value: 0, fn: ()=>{}},
    {key: 'disconnect', name: $_('disconnect'), value: 0, fn: ()=>{confirmDisconnect=true}},
  ]

  let confirmDisconnect = false;
  const disconnect = () => {confirmDisconnect=false; goto('/home'); MixinDisconnect();}
</script>

<div class="flex flex-col mt-4 px-6">
  {#each items as item}
    {#if item.key != 'disconnect'}
      <button class="flex justify-between items-center my-4" on:click={()=>item.fn()}>
        <!-- Left -->
        <div>
          <span class="font-bold text-sm"> {item.name} </span>
        </div>

        <!-- Right -->
        <div class="flex space-x-2 items-center">
          {#if item.value != 0}
            <span class="text-xs text-[9px] opacity-60"> {item.value} </span>
          {/if}

          {#if item.key === 'theme'}
            <button class="flex items-center justify-center rounded-full p-0 h-6 w-6">
              <!-- Theme Switch Icon -->
              <label class="swap swap-rotate">
                <!-- this hidden checkbox controls the state -->
                <input type="checkbox" class="theme-controller"/>
                
                <!-- sun icon -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <svg on:click={()=>toggleTheme()} class="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
                
                <!-- moon icon -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <svg on:click={()=>toggleTheme()} class="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
              </label>
            </button>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-xs" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          {/if}
        </div>
      </button>
    
    {:else}
      {#if $mixinConnected}
        {#if !confirmDisconnect}
          <!-- Disconnect -->
          <button class="flex justify-between items-center my-4" on:click={()=>item.fn()}>
            <!-- Left -->
            <div>
              <span class="font-bold text-sm"> {item.name} </span>
            </div>

            <!-- Right -->
            <div class="flex space-x-2 items-center">
              <button class="flex items-center justify-center rounded-full p-0 h-6 w-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          </button>
        {:else}
          <!-- Confirm Disconnect -->
          <button class="flex justify-between items-center my-4">
            <!-- Left -->
            <div>
              <span class="font-bold text-sm"> { $_('confirm_disconnect') } </span>
            </div>

            <!-- Right -->
            <div class="flex space-x-4 items-center">
              <button class="flex items-center justify-center rounded-full p-0 h-5 w-5" on:click={()=>confirmDisconnect=false}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>

              <button class="flex items-center justify-center rounded-full p-0 h-5 w-5" on:click={()=>disconnect()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>              
              </button>
            </div>
          </button>
        {/if}
      {/if}
    {/if}
  {/each}
</div>