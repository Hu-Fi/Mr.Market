<script lang="ts">
  import { _ } from "svelte-i18n";
  import Entrance from "./elements/entrance.svelte";
  import Ongoing from "./elements/ongoing.svelte";
  import { mixinConnected } from "$lib/stores/home";
  import GrowAddMore from "$lib/components/dialogs/grow/growAddMore.svelte";
  import ConnectWalletBtn from "$lib/components/common/connectWalletBtn.svelte";
</script>

<Entrance />
{#if $mixinConnected}
  <Ongoing />
  <GrowAddMore />
{:else}
  <div class="flex flex-col space-y-6 grow justify-center items-center mb-24">
    <svg class="w-32" viewBox="0 0 142 151" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_516_15834)"><path fill-rule="evenodd" clip-rule="evenodd" d="M61.5693 11.1915C61.5693 8.82375 63.4459 6.9043 65.7607 6.9043H76.2392C78.554 6.9043 80.4305 8.82375 80.4305 11.1915V34.7712H82.5262V21.9096C82.5262 19.5418 84.4028 17.6223 86.7176 17.6223H95.1004C97.4152 17.6223 99.2918 19.5418 99.2918 21.9096V34.8466C113.12 35.8448 124.302 46.6444 126.239 60.4945H128.631C132.104 60.4945 134.918 63.3737 134.918 66.9254V84.0742C134.918 87.6259 132.104 90.5051 128.631 90.5051H126.239C124.205 105.049 111.977 116.228 97.1961 116.228H80.4305V139.808C80.4305 142.176 78.554 144.095 76.2392 144.095H65.7607C63.4459 144.095 61.5693 142.176 61.5693 139.808V116.228H59.4737V124.803C59.4737 127.171 57.5971 129.09 55.2823 129.09H46.8995C44.5847 129.09 42.7081 127.171 42.7081 124.803V116.153C28.8803 115.155 17.6981 104.355 15.7613 90.5051H13.3685C9.89624 90.5051 7.08142 87.6259 7.08142 84.0742V66.9254C7.08142 63.3737 9.89624 60.4945 13.3685 60.4945H15.7613C17.7951 45.951 30.0231 34.7712 44.8038 34.7712H61.5693V11.1915ZM97.1961 45.4893H44.8038C34.3871 45.4893 25.9426 54.1268 25.9426 64.7817V86.2178C25.9426 96.8728 34.3871 105.51 44.8038 105.51H97.1961C107.613 105.51 116.057 96.8728 116.057 86.2178V64.7817C116.057 54.1268 107.613 45.4893 97.1961 45.4893ZM61.5693 75.4998C61.5693 81.4192 56.878 86.2178 51.0909 86.2178C45.3038 86.2178 40.6125 81.4192 40.6125 75.4998C40.6125 69.5804 45.3038 64.7817 51.0909 64.7817C56.878 64.7817 61.5693 69.5804 61.5693 75.4998ZM93.0047 86.2178C98.7918 86.2178 103.483 81.4192 103.483 75.4998C103.483 69.5804 98.7918 64.7817 93.0047 64.7817C87.2176 64.7817 82.5262 69.5804 82.5262 75.4998C82.5262 81.4192 87.2176 86.2178 93.0047 86.2178Z" fill="url(#paint0_linear_516_15834)"/></g><defs><filter id="filter0_d_516_15834" x="0.845467" y="0.668343" width="140.309" height="149.663" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="3.11798"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.121568 0 0 0 0 0.160784 0 0 0 0 0.215687 0 0 0 0.14 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_516_15834"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_516_15834" result="shape"/></filter><linearGradient id="paint0_linear_516_15834" x1="10.1994" y1="34.9661" x2="125.565" y2="123.828" gradientUnits="userSpaceOnUse"><stop stop-color="#4338CA"/><stop offset="1" stop-color="#211C64"/></linearGradient></defs></svg>
    <span class="font-bold">
      {$_('connect_wallet_order_intro')}
    </span>
    <ConnectWalletBtn clazz="bg-slate-800 text-base-100 hover:bg-slate-800"/>
  </div>
{/if}