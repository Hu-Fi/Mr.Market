<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { OutputAsset, OutputBalanceAccount, OutputBalanceDialog } from "$lib/stores/swap";

  const accounts = [
    { name: $_("mixin_wallet"), key: 'mixin', balance: 21.2134 },
    { name: $_("trading_account"), key: 'trading', balance: 324.1234 },
  ];
  onMount(()=>{ OutputBalanceAccount.set(accounts[0]) })
  let active = 'mixin'
</script>

<dialog
  id="swap_output_balance_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$OutputBalanceDialog}
>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => OutputBalanceDialog.set(false)}></button>
  </form>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-6">
      <!-- Close -->
      <div class="flex justify-between">
        <span class="font-semibold">
          {$_("receive_to_account")}
        </span>
        <button on:click={() => OutputBalanceDialog.set(false)}>
          <!-- Close Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            /></svg
          >
        </button>
      </div>
    </div>

    <div class="flex flex-col !mt-6">
      {#each accounts as acc, i}
        <button class="flex items-center justify-between" on:click={()=>{active = acc.key; OutputBalanceAccount.set(acc); OutputBalanceDialog.set(false)}} data-testid={`output-account-${i}`}>
          <div class="flex items-center space-x-3 py-3">
            <div
              type="checkbox"
              checked={acc.key === active}
              class="checkbox checkbox-sm rounded-full"
            />
            <span class="text-sm">
              {acc.name}
            </span>
          </div>

          <div class="flex items-center">
            <span class="text-xs opacity-60"> 
              {acc.balance} {$OutputAsset.symbol}
            </span>
          </div>
        </button>
      {/each}
    </div>
  </div>
</dialog>