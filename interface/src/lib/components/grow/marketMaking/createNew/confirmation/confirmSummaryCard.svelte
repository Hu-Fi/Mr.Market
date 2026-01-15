<script lang="ts">
  export let title: string;
</script>

<div
  class="rounded-none bg-base-100 p-5 border-base-300 border-x border-b first:border-t first:rounded-t-[2rem] last:rounded-b-[2rem] w-full"
>
  <div class="flex items-center gap-4">
    <div class="flex items-center justify-center shrink-0">
      <slot name="icon" />
    </div>
    <div class="flex flex-col gap-1 w-full overflow-hidden">
      <span class="text-xs font-bold tracking-wide opacity-40 capitalize">
        {title}
      </span>
      <div
        class="text-base-content text-[15px] font-bold leading-tight truncate"
      >
        <slot name="value" />
      </div>
    </div>
  </div>
</div>
