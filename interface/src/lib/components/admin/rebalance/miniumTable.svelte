<script>
  import { _ } from "svelte-i18n";
  const b = [];
</script>

<div class="overflow-x-auto flex flex-col space-y-4">
  <div class="flex items-center">
    <button class="btn btn-xs btn-ghost hover:bg-base-100 no-animation">
      <span class="font-semibold text-base"> {$_("minium_balance_settings")} </span>
    </button>
  </div>
  <table class="table mt-4">
    <!-- head -->
    <thead>
      <tr>
        <th></th>
        <th>{$_("exchange")}</th>
        <th>{$_("type")}</th>
      </tr>
    </thead>
    <tbody>

    </tbody>
  </table>
</div>
