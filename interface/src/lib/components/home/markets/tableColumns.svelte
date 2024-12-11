<script lang="ts">
  import { _ } from "svelte-i18n"

  let tableHeaders = [$_('name'), $_('price'), $_('24chg')]
</script>

<thead>
  <tr class="flex justify-between border-b-0">
    <th class="cursor-pointer pb-2 md:first:pl-7 md:last:pr-7">
      <span class="text-xs !text-[10px]">{tableHeaders[0]}</span>
    </th>

    <div class="flex space-x-1 mr-1">
      <th class="cursor-pointer pb-2 md:first:pl-7 md:last:pr-7">
        <span class="text-xs !text-[10px]">{tableHeaders[1]}</span>
      </th>
  
      <th class="cursor-pointer pb-2 md:first:pl-7 md:last:pr-7">
        <span class="text-xs !text-[10px]">{tableHeaders[2]}</span>
      </th>
    </div>
  </tr>
</thead>
