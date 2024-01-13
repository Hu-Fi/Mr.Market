<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  let sections = [
    { name: $_("trade"), fn: () => {} },
    { name: $_("earn"), fn: () => {} },
  ];
</script>

<!-- Actions -->
<div class="join grid grid-cols-2 w-full p-6 pt-3">
  {#each sections as section, i}
    <button
      class={clsx(
        "btn btn-sm h-[2.5rem] join-item border-none no-animation",
        "bg-slate-50 focus:bg-slate-50",
      )}
      on:click={() => {}}
    >
      <span class="font-medium text-sm">
        {section.name}
      </span>
    </button>
  {/each}
</div>
