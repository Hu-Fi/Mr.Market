<script lang="ts">
  export let title: string;
</script>

<div class="rounded-2xl border border-base-300 p-4">
  <div class="flex items-center gap-3">
    <div class="flex items-center justify-center">
      <slot name="icon" />
    </div>
    <div class="flex flex-col">
      <span class="text-xs font-semibold uppercase opacity-60">
        {title}
      </span>
      <div class="text-base font-semibold text-base-content">
        <slot name="value" />
      </div>
    </div>
  </div>
</div>

