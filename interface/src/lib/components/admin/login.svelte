<script lang="ts">
  import { _ } from "svelte-i18n";
  import { AdminPassword } from "$lib/helpers/hufi/admin";
  import { submitted, checked, correct } from "$lib/stores/admin";
  
  let loading = false;
  let password = '';

  const login = async () => {
    loading = true;
    if (await checkPassword(password)) {
      submitted.set(true);
      checked.set(true);
      correct.set(true);
      loading = false;
      return;
    }
    submitted.set(true);
    checked.set(true);
    correct.set(false);
    loading = false;
  };

  const checkPassword = async (pass: string):Promise<boolean> => {
    // Fetch API
    if (!pass) {
      return false;
    }
    const r = await AdminPassword(pass)
    return r.result;
  }
</script>

<div
  class="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800"
>
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
    {$_("login")}
  </h2>
  <div>
    <label
      for="password"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >{$_('enter_password')}</label
    >
    <input
      type="password"
      name="password"
      id="password"
      placeholder="••••••••"
      bind:value={password}
      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
      required
    />
  </div>
  {#if $submitted && $checked && !$correct}
    <div>
      <span class="text-red-400 capitalize">
        {$_("error")}: {$_("password_incorrect")}
      </span>
    </div>
  {/if}
  <button
    type="submit"
    on:click={() => {
      login();
    }}
    class="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-center text-white bg-base-content rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
  >
    {#if loading}
      <span class="loading"> </span>
    {:else}
      <span>{$_("login")}</span>
    {/if}
  </button>
</div>
