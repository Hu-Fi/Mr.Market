<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { exit } from "$lib/helpers/mrm/admin";
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
    "exit",
  ];
  const items = paths.map((path) => {
    return {
      key: path,
      name: $_(path),
      value: `/manage/${path}`,
      fn:
        path === "exit"
          ? () => {
              exit();
            }
          : () => {
              goto(`/manage/${path}`);
            },
    };
  });
</script>

<aside
  id="sidebar"
  class="fixed hidden z-20 h-full top-0 left-0 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
  aria-label="Sidebar"
>
  <div
    class="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0"
  >
    <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div class="flex-1 px-3 bg-white divide-y space-y-1">
        <ul class="space-y-2 pb-2">
          {#each items as item}
            <li>
              <button
                on:click={() => item.fn()}
                class={clsx(
                  "w-full text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group cursor-pointer",
                  $page.url.pathname.includes(`manage/${item.key}`) &&
                    "bg-gray-100",
                )}
              >
                <SideBarIcons name={item.key} />
                <span class="ml-3">{item.name}</span>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</aside>
<div
  class="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"
  id="sidebarBackdrop"
></div>
