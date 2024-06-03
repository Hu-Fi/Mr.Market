<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { onDestroy } from "svelte";
  import { createJustGrowLockTime, createJustGrowLockTimeDialog } from "$lib/stores/grow";

  onDestroy(() => {
    createJustGrowLockTime.set();
    createJustGrowLockTimeDialog.set(false);
  })

  const locktimes = [
    { key: $_('1_week'), value: '7'},
    { key: $_('2_weeks'), value: '14'},
    { key: $_('1_month'), value: '30'},
  ]
</script>

<div class="flex flex-col space-y-2 mx-4">
  <div class="flex items-center justify-between space-x-2 mx-2">
    <div class="flex space-x-2 items-center">
      <span class="text-sm">
        {$_('lock_time')}
      </span>
    </div>

    <details class="dropdown dropdown-end" bind:open={$createJustGrowLockTimeDialog}>
      <summary class="flex justify-between text-end border rounded-lg items-center w-[11.5rem] h-12">
        <span class={clsx("text-sm mx-3", !$createJustGrowLockTime && "opacity-40")}> 
          {$createJustGrowLockTime ? $createJustGrowLockTime.key : $_('select_lock_time')} 
        </span>
        <div class="mx-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </summary>
      <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 text-sm">
        {#each locktimes as time}
          <li>
            <button on:click={()=>{ 
              createJustGrowLockTimeDialog.set(false);
              createJustGrowLockTime.set(time);
            }}>
              {time.key}
            </button>
          </li>
        {/each}
      </ul>
    </details>
  </div>
</div>