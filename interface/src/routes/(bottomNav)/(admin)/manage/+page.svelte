<script>
  import { goto } from "$app/navigation";
  import { _ } from "svelte-i18n";

  const items = [
    { label: "exchanges", route: "/manage/exchanges" },
    { label: "strategies", route: "/manage/strategies" },
    { label: "settings", route: "/manage/settings" },
  ];
</script>

<div class="flex flex-col gap-4 justify-center items-center h-[100vh] space-y-16">
  <span class="text-3xl font-bold">{$_("welcome_to_admin_panel")}</span>

  <div class="flex flex-row gap-4">
    {#each items as item}
      <button
        class="btn rounded-2xl w-64 h-60 flex flex-col items-start justify-between"
        on:click={() => {
          goto(item.route);
        }}
      >
        <div class="flex flex-row justify-end w-full mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 opacity-60">
            <path fill-rule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>          
        </div>
        <span class="text-base mb-6 ml-2 font-semibold">
          {$_("manage_something", { values: { name: item.label } })}
        </span>
      </button>
    {/each}
  </div>
</div>
