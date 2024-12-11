<script lang="ts">
  import { _ } from "svelte-i18n"
</script>

<div class="flex flex-col space-y-10 mt-4">
  <div class="flex flex-col space-y-4">
    <div class="px-4 text-lg font-bold">
      <span> {$_('whats_simply_grow')} </span>
    </div>
    <div class="px-4 text-sm text-[10px] text-base-content/60">
      <span> {$_('whats_simply_grow_answer')} </span>
    </div>
  </div>
  
  <div class="flex flex-col space-y-4">
    <div class="px-4 text-lg font-bold">
      <span> {$_('what_re_benefits')} </span>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="px-4 text-sm font-bold">
        <span> {$_('easy_to_participate')} </span>
      </div>
      <div class="px-4 text-sm text-[10px] text-base-content/60">
        <span> {$_('easy_to_participate_detail')} </span>
      </div>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="px-4 text-sm font-bold">
        <span> {$_('no_fees')} </span>
      </div>
      <div class="px-4 text-sm text-[10px] text-base-content/60">
        <span> {$_('no_fees_detail')} </span>
      </div>
    </div>
  </div>
</div>