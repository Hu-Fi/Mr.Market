<script>
  import { _ } from "svelte-i18n";
  import CreateProgress from "./createProgress.svelte";
</script>

<div class="flex flex-col gap-2 mx-6">
  <span class="text-xl font-semibold">
    {$_("launch_market_making")}
  </span>

  <CreateProgress step={1} />
</div>
