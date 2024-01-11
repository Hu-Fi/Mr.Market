<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { keys, asc, selectedField } from "$lib/stores/home";

  let tableHeaders = [$_('name'), $_('price'), $_('24chg')]
</script>

<thead>
  <tr class="flex justify-between border-b-0">
    <th class="cursor-pointer pb-2 md:first:pl-7 md:last:pr-7" on:click={ () => {selectedField.set(keys[0])} } >
      <button class="flex items-center" on:click={() => ($asc = !$asc) }>
        <span class="text-xs !text-[10px]">{tableHeaders[0]}</span>
        <button class={clsx("flex flex-col space-y-[-8px]", $selectedField != keys[0] && "opacity-50")}>
          <!-- Caret Up Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3 w-3"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill={$selectedField === keys[0] ? $asc ? "currentColor" : "black" : "currentColor"}></path></svg>
          <!-- Caret Down Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3 w-3"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill={$selectedField === keys[0] ? !$asc ? "currentColor" : "black" : "currentColor"}></path></svg>
        </button>
      </button>
    </th>

    <div>
      <th class="cursor-pointer pb-2 md:first:pl-7 md:last:pr-7" on:click={() => {selectedField.set(keys[1]);}} >
        <button class="flex items-center" on:click={() => ($asc = !$asc)}>
          <span class="text-xs !text-[10px]">{tableHeaders[1]}</span>
          <button class={clsx("flex flex-col space-y-[-8px]", $selectedField != keys[1] && "opacity-50")}>
            <!-- Caret Up Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3 w-3"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill={$selectedField === keys[1] ? !$asc ? "currentColor" : "black" : "currentColor"}></path></svg>
            <!-- Caret Down Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3 w-3"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill={$selectedField === keys[1] ? $asc ? "currentColor" : "black" : "currentColor"}></path></svg>
          </button>
        </button>
      </th>
  
      <th class="cursor-pointer pb-2 md:first:pl-7 md:last:pr-7" on:click={() => {selectedField.set(keys[2]);}} >
        <button class="flex items-center" on:click={() => ($asc = !$asc)}>
          <span class="text-xs !text-[10px]">{tableHeaders[2]}</span>
          <button class={clsx("flex flex-col space-y-[-8px]", $selectedField != keys[2] && "opacity-50")}>
            <!-- Caret Up Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3 w-3"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill={$selectedField === keys[2] ? !$asc ? "currentColor" : "black" : "currentColor"}></path></svg>
            <!-- Caret Down Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3 w-3"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill={$selectedField === keys[2] ? $asc ? "currentColor" : "black" : "currentColor"}></path></svg>
          </button>
        </button>
      </th>
    </div>
  </tr>
</thead>
