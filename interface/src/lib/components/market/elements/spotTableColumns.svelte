<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onDestroy } from "svelte";
  import { darkTheme } from "$lib/stores/theme";
  import {
    asc,
    spotKeys,
    spotSelectedField,
  } from "$lib/stores/market";
  import { page } from "$app/stores";

  let tableHeaders = [$_("name"), $_("price"), $_("24chg")];

  onDestroy(() => {
    spotSelectedField.set(spotKeys[0]);
    asc.set(true);
  });
</script>

<thead>
  <tr class="flex justify-between border-b-0">
    <th
      class="cursor-pointer pb-2 md:first:pl-7 md:last:pr-7"
      on:click={() => {
        if ($page.url.pathname.includes("market/token")){
          if ($spotSelectedField == spotKeys[0]) {
            return;
          }
          spotSelectedField.set(spotKeys[0]);
        } else if ($page.url.pathname.includes("market/spot")) {
          if ($spotSelectedField == spotKeys[0]) {
            return;
          }
          spotSelectedField.set(spotKeys[0]);
        }
        asc.set(true);
      }}
    >
      <button class="flex items-center" on:click={() => ($asc = !$asc)}>
        <span class="text-xs !text-[10px]">{tableHeaders[0]} / {$_('market_cap')}</span>
        <button
          class={clsx(
            "flex flex-col space-y-[-8px]",
            $spotSelectedField != spotKeys[0] && "opacity-50",
          )}
        >
          <!-- Caret Up Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-3 w-3"
            ><path
              xmlns="http://www.w3.org/2000/svg"
              d="M7 14L12 8L17 14L7 14Z"
              fill={$spotSelectedField === spotKeys[0]
                ? $asc
                  ? "currentColor"
                  : $darkTheme
                    ? "white"
                    : "black"
                : "currentColor"}
            ></path></svg
          >
          <!-- Caret Down Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-3 w-3"
            ><path
              xmlns="http://www.w3.org/2000/svg"
              d="M17 10L12 16L7 10H17Z"
              fill={$spotSelectedField === spotKeys[0]
                ? !$asc
                  ? "currentColor"
                  : $darkTheme
                    ? "white"
                    : "black"
                : "currentColor"}
            ></path></svg
          >
        </button>
      </button>
    </th>

    <div>
      <th
        class="cursor-pointer pb-2 md:first:pl-7 md:last:pr-7"
        on:click={() => {
          if ($page.url.pathname.includes("market/token")){
            if ($spotSelectedField == spotKeys[1]) {
              return;
            }
            spotSelectedField.set(spotKeys[1]);
          } else if ($page.url.pathname.includes("market/spot")) {
            if ($spotSelectedField == spotKeys[1]) {
              return;
            }
            spotSelectedField.set(spotKeys[1]);
          }
          asc.set(false);
        }}
      >
        <button class="flex items-center" on:click={() => ($asc = !$asc)}>
          <span class="text-xs !text-[10px]">{tableHeaders[1]}</span>
          <button
            class={clsx(
              "flex flex-col space-y-[-8px]",
              $spotSelectedField != spotKeys[1] && "opacity-50",
            )}
          >
            <!-- Caret Up Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-3 w-3"
              ><path
                xmlns="http://www.w3.org/2000/svg"
                d="M7 14L12 8L17 14L7 14Z"
                fill={$spotSelectedField === spotKeys[1]
                  ? !$asc
                    ? "currentColor"
                    : $darkTheme
                      ? "white"
                      : "black"
                  : "currentColor"}
              ></path></svg
            >
            <!-- Caret Down Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-3 w-3"
              ><path
                xmlns="http://www.w3.org/2000/svg"
                d="M17 10L12 16L7 10H17Z"
                fill={$spotSelectedField === spotKeys[1]
                  ? $asc
                    ? "currentColor"
                    : $darkTheme
                      ? "white"
                      : "black"
                  : "currentColor"}
              ></path></svg
            >
          </button>
        </button>
      </th>

      <th
        class="cursor-pointer pb-2 md:first:pl-7 md:last:pr-7"
        on:click={() => {
          if ($page.url.pathname.includes("market/token")){
            if ($spotSelectedField == spotKeys[2]) {
              return;
            }
            spotSelectedField.set(spotKeys[2]);
          } else if ($page.url.pathname.includes("market/spot")) {
            if ($spotSelectedField == spotKeys[2]) {
              return;
            }
            spotSelectedField.set(spotKeys[2]);
          }
          asc.set(false);
        }}
      >
        <button class="flex items-center" on:click={() => ($asc = !$asc)}>
          <span class="text-xs !text-[10px]">{tableHeaders[2]}</span>
          <button
            class={clsx(
              "flex flex-col space-y-[-8px]",
              $spotSelectedField != spotKeys[2] && "opacity-50",
            )}
          >
            <!-- Caret Up Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-3 w-3"
              ><path
                xmlns="http://www.w3.org/2000/svg"
                d="M7 14L12 8L17 14L7 14Z"
                fill={$spotSelectedField === spotKeys[2]
                  ? !$asc
                    ? "currentColor"
                    : $darkTheme
                      ? "white"
                      : "black"
                  : "currentColor"}
              ></path></svg
            >
            <!-- Caret Down Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-3 w-3"
              ><path
                xmlns="http://www.w3.org/2000/svg"
                d="M17 10L12 16L7 10H17Z"
                fill={$spotSelectedField === spotKeys[2]
                  ? $asc
                    ? "currentColor"
                    : $darkTheme
                      ? "white"
                      : "black"
                  : "currentColor"}
              ></path></svg
            >
          </button>
        </button>
      </th>
    </div>
  </tr>
</thead>
