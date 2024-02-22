<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { amount, buy, orderConfirmDialog, pair, price, total } from "$lib/stores/trade";

  $: infos = [
    {title: $_('payment_amount'), value: $buy ? `${$total} ${$pair.symbol.split('/')[1]}` : `${$amount} ${$pair.symbol.split('/')[0]}`},
    {title: $_('estimated_price'), value: $price},
    {title: $_('recipient'), value: $_('mixin_wallet')},
  ]

  let loading = false;
  const confirmPayment = ()=> {
    loading=true
    setTimeout(()=>{
      loading=false
    }, 30000)
  }
</script>

<dialog
  id="order_confirm_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$orderConfirmDialog}
>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-4">
      <!-- Title -->
      <div class="flex justify-between">
        <span class="font-semibold"> {$_("confirm_order")} </span>
        <button on:click={()=> orderConfirmDialog.set(false)}>
          <!-- Close Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- Estimate receive -->
      <div class="h-40 flex flex-col justify-center text-center space-y-2">
        <span class="text-xs opacity-60">
          {$_('estimated_receive')}
        </span>
        <span class="text-3xl font-bold">
          {$buy ? $amount : $total} {$buy ? $pair.symbol.split('/')[0] : $pair.symbol.split('/')[1]}
        </span>
      </div>

      <!-- Infos -->
      <div class="flex flex-col space-y-4 my-2 mb-4">
        {#each infos as info, i}
          <div class="flex justify-between text-sm">
            <span class="text-base-content/60">
              {info.title}
            </span>

            {#if i === 0}
              <!-- Payment Amount -->
              <span>
                {info.value}
              </span>
            {:else if i === 1}
              <!-- Exchange price -->
              <span>
                1 {$pair.symbol.split('/')[0]} = {info.value} {$pair.symbol.split('/')[1]}
              </span>
            {:else}
              <span>
                {info.value}
              </span>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Button -->
      <div class="w-full py-4 mb-4">
        <button class={clsx("btn btn-md w-full rounded-full bg-base-content hover:bg-base-content focus:bg-base-content no-animation")} on:click={confirmPayment}>
          <span class={clsx("text-base-100 font-semibold", loading && "loading loading-spinner")}> {$_('confirm_order')}</span>
        </button>
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => orderConfirmDialog.set(false)}></button>
  </form>
</dialog>