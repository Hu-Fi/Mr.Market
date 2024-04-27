<script lang="ts">
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { pair } from "$lib/stores/spot";
  import { CandlePair } from "$lib/stores/market";

  $: utils = [
    // {icon: 'futures', route: '/home', title: $_('futures')},
    // {icon: 'alert', route: '/market', title: $_('alert')},
    {icon: 'more', route: '/market', title: $_('more'), fn: ()=>{goto('/home/more')}},
  ]
</script>

<div class="btm-nav btm-nav-md shadow-2xl bg-base-100 visible md:invisible px-4">
  <div class="flex flex-row justify-center items-center space-x-4 mr-2 h-full">
    <!-- Trade button -->
    <button class="btn btn-outline no-animation border-base-300 bg-slate-800 flex grow items-center justify-center rounded-full" on:click={()=>{pair.set($CandlePair); goto(`/spot`)}}>
      <span class="font-semibold px-6 text-base-100"> {$_('trade')} </span>
    </button>

    <div class="flex flex-row items-center space-x-6">
      {#each utils as u}
        <button class="flex flex-col justify-center items-center" on:click={()=>{u.fn()}} >
          <!-- Icon -->
          <div>
            {#if u.icon === 'futures'}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>          
            {:else if u.icon === 'more'}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
            {:else if u.icon === 'alert'}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" /></svg>          
            {/if}
          </div>

          <!-- Title -->
          <span class="text-[10px]"> {u.title} </span>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>

</style>