<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
</script>

<div class="flex flex-col space-y-2">
  <span class="text-sm">
    {$_('period')} 
  </span>

  <input class="input input-bordered focus:outline-none" />
</div>