<script>
  import { goto } from "$app/navigation";
  import { _ } from "svelte-i18n";
</script>

<div class="flex flex-col gap-4 justify-center items-center h-[100vh]">
  <span class="text-2xl font-bold">{$_("welcome_to_admin_panel")}</span>
  <button
    class="btn"
    on:click={() => {
      goto("/manage/dashboard");
    }}
    >
    {$_("dashboard")}
  </button>
</div>
