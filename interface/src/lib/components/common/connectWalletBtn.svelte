<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
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
          window.open(url);
        },
        onError: (error: Error) => {
          console.error(error);
          mixinConnectLoading.set(false);
          return;
        },
        onSuccess: async (token: string) => {
          await AfterMixinOauth(token);
          mixinConnectLoading.set(false);
        },
      },
    );
  };

  export let clazz: string;
</script>

<button
  class={clsx("btn rounded-full no-animation text-base-100 !h-10 min-h-10 bg-slate-800 hover:bg-slate-800 focus:bg-slate-800", clazz)}
  on:click={async () => {
    await auth();
  }}
  disabled={$mixinConnectLoading}
>
  {#if $mixinConnectLoading}
    <span class="loading loading-xs mx-3 text-base-100" />
  {:else}
    <span
      class={clsx(
        "font-semibold",
      )}
    >
      {$_("connect_wallet")}
    </span>
  {/if}
</button>
