<script lang="ts">
  import { _ } from "svelte-i18n"
  import AppIcon from "$lib/components/home/applications/appIcon.svelte";

  export let title = "trade"
  export let apps = [{name: $_("swap"), icon: "swap", fn: ()=>{}}]
</script>

<div class="px-3 flex flex-col space-y-4">
  <span class="ml-2 font-semibold">
    {title}
  </span>
  <div class="grid grid-cols-4 gap-4">
    {#each apps as app}
      <div class="flex flex-col justify-center items-center space-y-1.5">
        <button class="btn btn-sm bg-base-100 hover:bg-base-100 hover:border-base-300 rounded-xl border-base-300 w-10 h-10 text-center shadow-sm no-animation px-2" on:click={()=>app.fn()} data-testid={`more-app-${app.icon}`}>
          <AppIcon icon={app.icon} />
        </button>
        <span class="text-[10px] text-center w-12 max-h-4 text-ellipsis text-[calc(12px + 1.5vw)]"> {app.name} </span>
      </div>
    {/each}
  </div>
</div>