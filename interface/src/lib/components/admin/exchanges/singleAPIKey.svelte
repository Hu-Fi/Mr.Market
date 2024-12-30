<script lang="ts">
  import { _ } from "svelte-i18n";
  import toast from "svelte-french-toast";
  import type { AdminSingleKey } from "$lib/types/hufi/admin";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import { loadExchangeApiKeys, removeExchangeApiKey } from "$lib/helpers/hufi/admin/exchange";
  
  export let key: AdminSingleKey;
  let loading = false;
  let deleteConfirm = false;

  const deleteAPIKey = async (key_id: string) => {
    loading = true;
    const token = localStorage.getItem("admin-access-token");
    if (!token) {
      return;
    }

    try {
      loading = false;
      const res = await removeExchangeApiKey(token, key_id);
      if (res.code === 200) {
        toast.success(`${res.message}`);
      } else {
        toast.error(`${res.message}`);
      }
    } catch (e: any) {
      toast.error(`${e.message}`);
      loading = false;
      deleteConfirm = false;
    }
    setTimeout(async () => {
      await loadExchangeApiKeys();
    }, 500);
  }
</script>

<div class="flex items-center justify-between p-4 border-b border-x first:border-t last:border-b">
  <div class="flex items-center space-x-4">
    <div class="avatar">
      <div class="mask mask-squircle w-8 h-8">
        <img src={findExchangeIconByIdentifier(key.exchange)} alt="" class="">
      </div>
    </div>
    <div class="flex flex-col select-text">
      <div class="flex items-center space-x-2">
        <span class="text-base capitalize font-semibold"> {key.name} </span>
        <span class="text-xs opacity-60"> {key.exchange} {key.key_id} </span>
      </div>
      <span class="text-xs opacity-60"> {key.api_key} </span>
    </div>
  </div>
  
  <div class="flex space-x-8">
    <!-- Actions -->
    <div class="flex items-center justify-center">
      {#if !deleteConfirm}
        <button class="btn btn-sm" on:click={()=>{deleteConfirm=true}}>
          <span>{$_('delete')}</span>
        </button>
      {:else}
        <div class="flex space-x-4 items-center mx-2">
          <button class="flex items-center justify-center rounded-full p-0 h-5 w-5" on:click={()=>deleteConfirm=false}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          <button class="flex items-center justify-center rounded-full p-0 h-5 w-5" on:click={()=>deleteAPIKey(key.key_id.toString())}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>