<script lang="ts">
  export let label: string;
  export let amount: string;
</script>

<div class="rounded-2xl border border-base-300 p-4">
  <span class="text-xs font-semibold uppercase opacity-60">
    {label}
  </span>
  <p class="text-2xl font-semibold text-base-content">
    {amount}
  </p>
</div>

