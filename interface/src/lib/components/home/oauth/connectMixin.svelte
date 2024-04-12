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
        onError: (error: Error) => {
          console.error(error);
          mixinConnectLoading.set(false);
          return;
        },
        onSuccess: async (token: string) => {
          await AfterMixinOauth(token)
          mixinConnectLoading.set(false);
          return;
        },
      },
    );
  };
</script>

<div class="flex items-center justify-between p-4 rounded-2xl mt-1">
  <div class="flex flex-col justify-center">
    <!-- Title -->
    <div class="flex items-center space-x-1 opacity-60">
      <span class="text-sm font-normal">
        {$_('total_balance')}
      </span>
    </div>
  
    <!-- Amount -->
    <div class="flex items-end space-x-2 mt-2 pb-1">
      <div class="flex items-end space-x-1">
        <span class="text-2xl font-extrabold break-words">
          *****
        </span>
      </div>
    </div>
  </div>
  <!-- Right -->
  <div class="">
    <button class="btn btn-sm h-[2.5rem] rounded-full bg-slate-800 hover:bg-slate-800 no-animation" on:click={()=>{auth(); mixinConnectLoading.set(true)}}>
      <span class={clsx("mx-3 font-semibold text-sm text-base-100", $mixinConnectLoading && "loading")}>{$_('connect')}</span>
    </button>
  </div>
</div>