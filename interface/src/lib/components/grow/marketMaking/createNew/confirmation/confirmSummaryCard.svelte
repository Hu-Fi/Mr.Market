<script lang="ts">
  export let title: string;
  export let cardType = "payment-info"; // 'exchange-info'
</script>

{#if cardType === "exchange-info"}
  <div
    class="rounded-none p-2 px-4 border border-base-300 first:rounded-t-xl! last:rounded-b-xl! first:border-b border-base-300"
  >
    <div class="flex items-center gap-4">
      <div class="flex items-center justify-center">
        <slot name="icon" />
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-xs font-normal tracking-wide opacity-40">
          {title}
        </span>
        <div class="text-base-content/80 text-sm font-semibold leading-tight">
          <slot name="value" />
        </div>
      </div>
    </div>
  </div>
{:else if cardType === "payment-info"}
  <div
    class="rounded-none border border-base-300 p-4 first:rounded-t-xl! last:rounded-b-xl!"
  >
    <div class="flex items-center gap-4">
      <div class="flex items-center justify-center">
        <slot name="icon" />
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-xs font-normal tracking-wide opacity-40">
          {title}
        </span>
        <div class="text-base-content/80 text-sm font-semibold leading-tight">
          <slot name="value" />
        </div>
      </div>
    </div>
  </div>
{/if}
