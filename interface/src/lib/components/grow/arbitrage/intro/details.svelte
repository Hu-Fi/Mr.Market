<script lang="ts">
  import { _ } from "svelte-i18n"
</script>

<div class="flex flex-col space-y-10 mt-4">
  <div class="flex flex-col space-y-4">
    <div class="px-4 text-lg font-bold">
      <span> {$_('whats_arbitrage')} </span>
    </div>
    <div class="px-4 text-sm">
      <span> {$_('whats_arbitrage_answer')} </span>
    </div>
  </div>
  
  <div class="flex flex-col space-y-4">
    <div class="px-4 text-lg font-bold">
      <span> {$_('what_re_benefits')} </span>
    </div>
    <div class="flex flex-col space-y-1">
      <div class="px-4 text-sm font-bold">
        <span> {$_('easy_to_participate')} </span>
      </div>
      <div class="px-4 text-sm">
        <span> {$_('easy_to_participate_detail')} </span>
      </div>
    </div>
    <div class="flex flex-col space-y-1">
      <div class="px-4 text-sm font-bold">
        <span> {$_('no_fees')} </span>
      </div>
      <div class="px-4 text-sm">
        <span> {$_('no_fees_detail')} </span>
      </div>
    </div>
  </div>
</div>