<script lang="ts">
  export let title: string;
  export let description: string;
</script>

<div class="space-y-2 text-start flex flex-col items-start justify-center">
  <div class="flex flex-col gap-2 items-start justify-center">
    <span class="text-2xl font-bold text-base-content">
      {title}
    </span>
    <span class="text-sm opacity-70">
      {description}
    </span>
  </div>
</div>
