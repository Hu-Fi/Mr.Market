<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { autoCheckPassword, checkPassword } from "$lib/helpers/hufi/admin";
  import { loginLoading, submitted, checked, correct } from "$lib/stores/admin";

  let password = "123123";

  const login = async (pass: string) => {
    loginLoading.set(true);
    // COMMENT FOR DEV
    const accessToken = await checkPassword(pass);
    if (accessToken) {
      submitted.set(true);
      checked.set(true);
      correct.set(true);
      localStorage.setItem("admin-password", pass);
      localStorage.setItem("admin-access-token", accessToken);
      loginLoading.set(false);
      goto('/manage/dashboard')
      return true;
    }
    // submitted.set(true);
    // checked.set(true);
    // correct.set(false);
    // return false;
  };

  onMount(() => {
    autoCheckPassword();
  });
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
      >{$_("enter_password")}</label
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
      login(password);
    }}
    class="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-center text-white bg-slate-800 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
  >
    {#if $loginLoading}
      <span class="loading"> </span>
    {:else}
      <span>{$_("login")}</span>
    {/if}
  </button>
</div>