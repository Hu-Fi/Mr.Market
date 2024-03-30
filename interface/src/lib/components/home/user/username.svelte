<script lang="ts">
  import { _ } from "svelte-i18n"
  import { user } from "$lib/stores/wallet";  
  import authorize from "$lib/helpers/mixin-oauth";
  import { AfterMixinOauth } from "$lib/helpers/mixin";
  import { BOT_ID, OAUTH_SCOPE } from "$lib/helpers/constants";
  import { mixinConnectLoading, mixinConnected } from "$lib/stores/home";
  
  const auth = async () => {
    mixinConnectLoading.set(true);
    await authorize(
      { clientId: BOT_ID, scope: OAUTH_SCOPE, pkce: true },
      { 
        onShowUrl: (url: string) => { window.open(url) }, onError: (error: Error) => { console.error(error); return; },
        onSuccess: async (token: string) => { await AfterMixinOauth(token)},
      },
    );
    mixinConnectLoading.set(false);
  };
</script>

{#if $mixinConnected}
  <div class="flex items-center mx-6 space-x-4 mt-4">
    {#if $user.avatar_url}
      <div class="avatar w-12 h-12">
        <img src={$user.avatar_url} alt="-" class="rounded-full" />
      </div>
    {:else}
      <div class="avatar w-14 h-14">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="opacity-15">
          <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
        </svg>
      </div>
    {/if}

    <div class="flex flex-col my-2 space-y-0">
      <div class="text-xl font-extrabold">
        <span> {$user.full_name} </span>
      </div>
      <div>
        <span class="text-xs !text-[11px] font-medium"> {$_('mixin_id', {values: {id: $user.identity_number} })} </span>
      </div>
    </div>
  </div>
{:else}
  <button class="flex items-center justify-start mx-6 space-x-4 mt-4" on:click={()=>{auth()}}>
    <div class="avatar w-14 h-14">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="opacity-15">
        <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
      </svg>
    </div>

    <div class="flex flex-col items-start justify-center my-2 space-y-0">
      <div class="text-xl font-extrabold">        
        <span> {$_('please_login')} </span>
      </div>
      <div>
        <span class="text-xs !text-[11px] font-medium"> {$_('please_login_info')} </span>
      </div>
    </div>
  </button>
{/if}