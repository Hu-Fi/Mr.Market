<script lang="ts">
  export let label: string | null = null;
  export let title: string;
  export let description: string;
</script>

<div class="space-y-2 text-start flex flex-col items-center">
  {#if label}
    <p class="text-xs font-semibold uppercase tracking-wide opacity-60">
      {label}
    </p>
  {/if}
  <div class="flex flex-col gap-2 items-start justify-center">
    <span class="text-2xl font-bold text-base-content">
      {title}
    </span>
    <span class="text-sm opacity-70">
      {description}
    </span>
  </div>
</div>
