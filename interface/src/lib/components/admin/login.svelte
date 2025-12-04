<script lang="ts">
  import { _ } from "svelte-i18n";
  import { createHash } from "crypto";
  import { goto } from "$app/navigation";
  import { checkPassword } from "$lib/helpers/hufi/admin";
  import { loginLoading, submitted, checked, correct } from "$lib/stores/admin";

  let password = "";

  const login = async (pass: string) => {
    loginLoading.set(true);
    const hashedAdminPassword = createHash("sha256").update(pass).digest("hex");
    const accessToken = await checkPassword(hashedAdminPassword);
    if (accessToken) {
      submitted.set(true);
      checked.set(true);
      correct.set(true);
      localStorage.setItem("admin-password", pass);
      localStorage.setItem("admin-access-token", accessToken);
      loginLoading.set(false);
      goto("/manage/dashboard");
      return true;
    }
    submitted.set(true);
    checked.set(true);
    correct.set(false);
    loginLoading.set(false);
    return false;
  };
</script>

<div
  class="flex flex-col items-center justify-center w-full max-w-md px-4 mx-auto"
>
  <div
    class="w-full bg-white rounded-2xl shadow-xl dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700"
  >
    <div class="p-8 sm:p-10">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {$_("login")}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {$_("welcome_to_admin_panel")}
        </p>
      </div>

      <form class="space-y-6" on:submit|preventDefault={() => login(password)}>
        <div>
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {$_("enter_password")}
          </label>
          <div class="relative">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              bind:value={password}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200"
              required
            />
          </div>
        </div>

        {#if $submitted && $checked && !$correct}
          <div
            class="p-3 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-200 dark:border-red-800"
            role="alert"
          >
            <span class="font-medium">{$_("error")}:</span>
            {$_("password_incorrect")}
          </div>
        {/if}

        <button
          type="submit"
          class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={$loginLoading}
        >
          {#if $loginLoading}
            <div class="flex items-center justify-center gap-2">
              <svg
                class="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{$_("loading")}...</span>
            </div>
          {:else}
            {$_("login")}
          {/if}
        </button>
      </form>
    </div>
  </div>
</div>
