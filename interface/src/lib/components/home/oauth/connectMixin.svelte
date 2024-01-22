<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import authorize from "$lib/helpers/mixin-oauth";
  import { AfterMixinOauth } from "$lib/helpers/mixin";
  import { mixinConnectLoading } from "$lib/stores/home";
  import { BOT_ID, OAUTH_SCOPE } from "$lib/helpers/constants";

  const auth = async () => {
    mixinConnectLoading.set(true);
    authorize(
      { clientId: BOT_ID, scope: OAUTH_SCOPE, pkce: true },
      {
        onShowUrl: (url: string) => {
          window.open(url)
        },
        onError: (error: any) => {
          console.error(error);
          return;
        },
        onSuccess: async (token: any) => {
          await AfterMixinOauth(token)
          return;
        },
      },
    );
    mixinConnectLoading.set(false);
  };
</script>

<div class="flex items-center justify-between p-4 rounded-2xl mt-1">
  <div class="flex flex-col justify-center w-full">
    <!-- Title -->
    <div class="flex items-center space-x-1 opacity-60">
      <span class="text-sm font-normal">
        {$_('total_balance')}
      </span>
    </div>
  
    <!-- Amount -->
    <div class="flex items-end space-x-2 mt-2 pb-1 justify-between">
      <div class="flex items-end space-x-1">
        <span class="text-2xl font-extrabold  break-words max-w-[calc(100vw-98px-30px-32px-16px)]">
          *****
        </span>
      </div>
    </div>
  </div>
  <!-- Right -->
  <div class="">
    <button class="btn btn-sm h-[2.5rem] rounded-full bg-base-content hover:bg-base-content no-animation" on:click={()=>{auth(); mixinConnectLoading.set(true)}}>
      <span class={clsx("mx-3 font-semibold text-sm text-base-100", $mixinConnectLoading && "loading")}>{$_('connect')}</span>
    </button>
  </div>
</div>


<style>

</style>