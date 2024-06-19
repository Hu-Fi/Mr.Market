<script lang="ts">
  import CreateIntro from "$lib/components/grow/justGrow/new/createIntro.svelte";
  import Amount from "$lib/components/grow/marketMaking/new/easy/amount.svelte";
  import Exchange from "$lib/components/grow/marketMaking/new/easy/exchange.svelte";
</script>

<div class="flex flex-col space-y-8">
  <Exchange />
  <Amount />
  <CreateIntro />
</div>