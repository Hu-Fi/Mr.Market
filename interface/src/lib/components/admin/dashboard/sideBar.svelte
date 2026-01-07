<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { exit } from "$lib/helpers/mrm/admin";
  import { theme, toggleTheme } from "$lib/stores/theme";
  import SideBarIcons from "./sideBarIcons.svelte";

  const paths = [
    // "dashboard",
    // "orders",
    // "users",
    // "exchanges",
    // "rebalance",
    // "health",
    // "message",
    "settings",
  ];
  const items = paths.map((path) => {
    return {
      key: path,
      name: $_(path),
      value: `/manage/${path}`,
      fn: () => {
        goto(`/manage/${path}`);
      },
    };
  });

  // Separate exit item
  const exitItem = {
    key: "exit",
    name: $_("exit"),
    value: "/manage/exit",
    fn: () => {
      exit();
    },
  };
</script>

<aside
  id="sidebar"
  class="fixed hidden z-20 h-full top-0 left-0 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
  aria-label="Sidebar"
>
  <div
    class="relative flex-1 flex flex-col min-h-0 border-r border-base-200 bg-base-100 h-full"
  >
    <!-- App Name/Logo at Top -->
    <div class="px-6 py-5 border-b border-base-200">
      <div class="flex items-center gap-3">
        <div class="avatar placeholder">
          <div
            class="bg-primary text-primary-content rounded-lg w-10 flex items-center justify-center"
          >
            <span class="text-xl font-bold">A</span>
          </div>
        </div>
        <span class="text-xl font-bold text-primary">{$_("admin")}</span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="flex-1 flex flex-col pt-4 pb-4 overflow-y-auto">
      <div class="flex-1 px-3 space-y-1">
        <ul class="menu menu-sm gap-1">
          {#each items as item}
            <li>
              <button
                on:click={() => item.fn()}
                class={clsx(
                  "flex items-center gap-3",
                  $page.url.pathname.includes(`manage/${item.key}`) && "active",
                )}
              >
                <SideBarIcons name={item.key} />
                <span>{item.name}</span>
              </button>
            </li>
          {/each}
          <li>
            <button
              on:click={() => exitItem.fn()}
              class="flex items-center gap-3"
            >
              <SideBarIcons name="exit" />
              <span>{exitItem.name}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Theme Toggle at Bottom -->
    <div class="px-3 py-4 border-t border-base-200">
      <button
        on:click={toggleTheme}
        class="btn btn-ghost btn-sm w-full justify-start gap-3"
      >
        {#if $theme === "light"}
          <!-- Sun icon for light mode -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>
        {:else}
          <!-- Moon icon for dark mode -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
        {/if}
        <span>{$_("toggle_theme")}</span>
      </button>
    </div>
  </div>
</aside>
<div
  class="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"
  id="sidebarBackdrop"
></div>
