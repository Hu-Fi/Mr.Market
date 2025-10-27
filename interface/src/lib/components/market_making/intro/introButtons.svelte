<script>
  import { _ } from "svelte-i18n";
</script>

<div class="mx-8 flex flex-col space-y-4">
  <button class="btn bg-base-content text-base-100 w-full rounded-lg no-animation">
    {$_('start_market_making')}
  </button>

  <button class="btn bg-base-100 text-base-content w-full rounded-lg no-animation">
    {$_('learn_more')}
  </button>
</div>