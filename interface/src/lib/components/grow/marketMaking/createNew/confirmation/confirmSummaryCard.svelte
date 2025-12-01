<script lang="ts">
  import clsx from "clsx";

  export let title: string;
  export let titleClass =
    "text-xs font-semibold tracking-wide opacity-40";
  export let valueClass =
    "text-base-content text-lg font-semibold leading-tight";
</script>

<div class="rounded-2xl border border-slate-200 p-4">
  <div class="flex items-center gap-4">
    <div class="flex items-center justify-center">
      <slot name="icon" />
    </div>
    <div class="flex flex-col gap-1">
      <span class={clsx(titleClass)}>
        {title}
      </span>
      <div class={clsx(valueClass)}>
        <slot name="value" />
      </div>
    </div>
  </div>
</div>

