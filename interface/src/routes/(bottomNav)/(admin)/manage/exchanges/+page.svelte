<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Loading from "$lib/components/common/loading.svelte";
  import { loadExchangeApiKeys } from "$lib/helpers/hufi/admin/exchange";

  import Actions from "$lib/components/admin/exchanges/actions.svelte";
  import KeyList from "$lib/components/admin/exchanges/keyList.svelte";
  import ExchangeStats from "$lib/components/admin/exchanges/exchangeStats.svelte";
  import ExchangeBalances from "$lib/components/admin/exchanges/exchangeBalances.svelte";
  import { exchangeApiKeys, exchangeApiKeysLoading } from "$lib/stores/admin";

  onMount(async () => {
    await loadExchangeApiKeys();
  });
</script>

<div class="p-8 flex flex-col space-y-6">
  {#if $exchangeApiKeysLoading}
    <div class="flex justify-center items-center h-[calc(100vh-10rem)]">
      <Loading />
    </div>
  {:else if $exchangeApiKeys.length === 0}
    <div class="flex flex-col justify-center items-center h-[calc(100vh-10rem)]">
      <p>{$_("no_exchange_api_key_added")}</p>
      <button class="btn btn-base-100 mt-4" on:click={() => {
        goto('/manage/exchanges/add');
      }}>{$_("add_api_key")}</button>
    </div>
  {:else}
    <ExchangeStats keys={$exchangeApiKeys} />
    <Actions />
    <ExchangeBalances />
    <KeyList keys={$exchangeApiKeys} />
  {/if}
</div>