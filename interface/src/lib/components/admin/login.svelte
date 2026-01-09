<script lang="ts">
  import { _ } from "svelte-i18n";
  import { createHash } from "crypto";
  import { goto } from "$app/navigation";
  import { checkPassword } from "$lib/helpers/mrm/admin";
  import { loginLoading, submitted, checked, correct } from "$lib/stores/admin";

  let password = "";
  let showPassword = false;
  let shakeError = false;

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
    // Trigger shake animation
    shakeError = true;
    setTimeout(() => (shakeError = false), 500);
    return false;
  };

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
  };
</script>

<div
  class="min-h-screen flex flex-col items-center justify-center w-full px-4 py-12 relative overflow-hidden animate-gradient bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950"
>
  <!-- Animated background orbs -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float"
      style="animation-delay: -3s;"
    ></div>
    <div
      class="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-float"
      style="animation-delay: -1.5s;"
    ></div>
  </div>

  <!-- Main card -->
  <div
    class="glass-card relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/30 dark:border-white/10 {shakeError
      ? 'animate-shake'
      : ''}"
  >
    <!-- Subtle glow effect behind card -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"
    ></div>

    <!-- Decorative top bar -->
    <div
      class="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
    ></div>

    <div class="relative p-8 sm:p-10">
      <!-- Header with icon -->
      <div class="mb-10 text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg"
        >
          <svg
            class="w-8 h-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2"
        >
          {$_("login")}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {$_("welcome_to_admin_panel")}
        </p>
      </div>

      <form class="space-y-6" on:submit|preventDefault={() => login(password)}>
        <div class="relative">
          <!-- Password input with floating label -->
          <div class="relative">
            {#if showPassword}
              <input
                type="text"
                name="password"
                id="password"
                placeholder=" "
                bind:value={password}
                class="peer w-full px-4 py-4 bg-white/50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                required
              />
            {:else}
              <input
                type="password"
                name="password"
                id="password"
                placeholder=" "
                bind:value={password}
                class="peer w-full px-4 py-4 bg-white/50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                required
              />
            {/if}
            <label
              for="password"
              class="absolute left-4 top-4 text-gray-500 dark:text-gray-400 pointer-events-none transition-all duration-300 origin-left
                     peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-500 dark:peer-focus:text-blue-400
                     peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-blue-500 dark:peer-[:not(:placeholder-shown)]:text-blue-400"
            >
              {$_("enter_password")}
            </label>

            <!-- Password visibility toggle -->
            <button
              type="button"
              on:click={togglePasswordVisibility}
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {#if showPassword}
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              {:else}
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- Error state with enhanced styling -->
        {#if $submitted && $checked && !$correct}
          <div
            class="p-4 text-sm text-red-700 dark:text-red-400 rounded-xl bg-red-50/80 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/50 flex items-start gap-3 animate-shake"
            role="alert"
          >
            <svg
              class="w-5 h-5 flex-shrink-0 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <span class="font-semibold block">{$_("error")}</span>
              <span class="text-red-600/80 dark:text-red-400/80"
                >{$_("password_incorrect")}</span
              >
            </div>
          </div>
        {/if}

        <!-- Enhanced submit button -->
        <button
          type="submit"
          class="glow-button w-full relative overflow-hidden text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300/50 dark:focus:ring-blue-800/50 font-semibold rounded-xl text-sm px-6 py-4 text-center transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
          disabled={$loginLoading}
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            {#if $loginLoading}
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
            {:else}
              <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>{$_("login")}</span>
            {/if}
          </span>
          <!-- Button shine effect -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
          ></div>
        </button>
      </form>

      <!-- Footer accent -->
      <div
        class="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
      >
        <div
          class="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500"
        >
          <svg
            class="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Secure login powered by Mr.Market</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes gradient-shift {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-4px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(4px);
    }
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-shift 8s ease infinite;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  :global(.dark) .glass-card {
    background: rgba(17, 24, 39, 0.8);
  }

  .glow-button {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }

  .glow-button:hover {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
  }

  :global(.dark) .glow-button {
    box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
  }

  :global(.dark) .glow-button:hover {
    box-shadow: 0 0 30px rgba(96, 165, 250, 0.5);
  }
</style>
