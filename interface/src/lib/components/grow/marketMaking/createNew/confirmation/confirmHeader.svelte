<script lang="ts">
  export let label: string;
  export let title: string;
  export let description: string;
</script>

<div class="space-y-2">
  <p class="text-xs font-semibold uppercase tracking-wide opacity-60">
    {label}
  </p>
  <p class="text-2xl font-semibold text-base-content">
    {title}
  </p>
  <p class="text-sm opacity-70">
    {description}
  </p>
</div>

