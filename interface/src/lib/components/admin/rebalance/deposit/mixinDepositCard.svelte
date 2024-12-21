<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from 'svelte';
  import { createQrSvgString } from "@svelte-put/qr";
  import { copyToClipboard } from "$lib/helpers/helpers";

  export let assetSymbol: string;
  export let assetIcon: string;
  export let chainSymbol: string;
  export let chainIcon: string;
  export let depositAddress: string;
  export let depositMemo: string;
  export let miniumDepositAmount: string;
  export let confirmations: string;

  let addressCopied = false;
  let memoCopied = false;
  let addressQrSrc = '';
  let memoQrSrc = '';
  
  const addressQrConfig = {
    data: depositAddress,
    width: 128,
    height: 128,
    margin: 2,
    backgroundFill: '#fff',
  };

  const memoQrConfig = {...addressQrConfig, data: depositMemo};

  onMount(async () => {
    addressQrSrc = createQrSvgString(addressQrConfig);
    memoQrSrc = createQrSvgString(memoQrConfig);
  });
</script>

<div class="flex flex-col space-y-8 items-start h-full justify-center shadow rounded-2xl p-6 w-96">
  <!-- Asset -->
  <div class="flex flex-row justify-between items-center w-full">
    <div class="flex flex-col items-start space-y-1">
      <span class="text-xs text-base-content/60">{$_("asset")}</span>
      <span class="text-base font-bold text-base-content">{assetSymbol}</span>
    </div>

    <img src={assetIcon} alt='' class="size-8" />
  </div>
  
  {#if chainSymbol != assetSymbol}
    <!-- Network -->
    <div class="flex flex-row justify-between items-center w-full">
      <div class="flex flex-col items-start space-y-1">
        <span class="text-xs text-base-content/60">{$_("network")}</span>
        <span class="text-base font-bold text-base-content">{chainSymbol}</span>
      </div>

      <img src={chainIcon} alt='' class="size-8" />
    </div>
  {/if}
  
  {#if depositMemo}
    <!-- Memo -->
    <div class="flex flex-row justify-between items-center w-full">
      <div class="flex flex-col items-start space-y-1">
        <span class="text-xs text-base-content/60">{$_("memo")}</span>
        <span class="text-base font-bold text-base-content break-all select-text mr-4">{depositMemo}</span>
      </div>

      <div class="tooltip" data-tip={memoCopied ? $_("copied") : $_("copy")}>
        <button on:click={() => {
          copyToClipboard(depositMemo);
          memoCopied = true;
          setTimeout(() => {
            memoCopied = false;
          }, 2000);
        }} class="btn-sm btn-circle flex items-center shadow-sm justify-center rounded-3xl no-animation bg-base-100 hover:bg-base-200 text-base-content btn-outline border-base-content/20 hover:border-base-content/20 hover:text-base-content opacity-80">
          {#if memoCopied}
            <!-- Check -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>        
          {:else}
            <!-- Copy -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <!-- Memo QR -->
    <div class="flex flex-row justify-center items-center w-full">
      <div class="relative rounded-2xl border p-1">
        <div class="absolute inset-0 flex items-center justify-center">
          <img src={assetIcon} alt='' class="size-8" />
        </div>
        {@html memoQrSrc}
      </div>
    </div>
  {/if}

  <!-- Address -->
  <div class="flex flex-row justify-between items-center w-full">
    <div class="flex flex-col items-start space-y-1">
      <span class="text-xs text-base-content/60">{$_("address")}</span>
      <span class="text-base font-bold text-base-content break-all select-text mr-4">{depositAddress}</span>
    </div>

    <div class="tooltip" data-tip={addressCopied ? $_("copied") : $_("copy")}>
      <button on:click={() => {
        copyToClipboard(depositAddress);
        addressCopied = true;
        setTimeout(() => {
          addressCopied = false;
        }, 2000);
      }} class="btn-sm btn-circle flex items-center shadow-sm justify-center rounded-3xl no-animation bg-base-100 hover:bg-base-200 text-base-content btn-outline border-base-content/20 hover:border-base-content/20 hover:text-base-content opacity-80">
        {#if addressCopied}
          <!-- Check -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>        
        {:else}
          <!-- Copy -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Address QR -->
  <div class="flex flex-row justify-center items-center w-full">
    <div class="relative rounded-2xl border p-1">
      <div class="absolute inset-0 flex items-center justify-center">
        <img src={assetIcon} alt='' class="size-8" />
      </div>
      {@html addressQrSrc}
    </div>
  </div>

  <!-- Minium Deposit Amount -->
  <div class="flex flex-row justify-between items-center w-full">
    <div class="flex flex-col items-start space-y-1">
      <span class="text-xs text-base-content/60">{$_("minium_deposit_amount")}</span>
      <span class="text-base font-bold text-base-content">{miniumDepositAmount}</span>
    </div>
  </div>

  <!-- Confirmations -->
  <div class="flex flex-row justify-between items-center w-full">
    <div class="flex flex-col items-start space-y-1">
      <span class="text-xs text-base-content/60">{$_("confirmations")}</span>
      <span class="text-base font-bold text-base-content">{confirmations}</span>
    </div>
  </div>
</div>
