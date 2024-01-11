<script lang="ts">
  import { _ } from "svelte-i18n";
</script>

<svg
  width="80"
  height="80"
  viewBox="0 0 80 80"
  fill="none"
  class="[[data-theme=dark]_&]:invert"
  xmlns="http://www.w3.org/2000/svg"
  ><path
    opacity=".1"
    d="M48 36H24m15 14H24m31-28H24m44 16.75V21.8c0-5.88 0-8.82-1.144-11.067a10.5 10.5 0 0 0-4.59-4.589C60.022 5 57.082 5 51.2 5H28.8c-5.88 0-8.82 0-11.067 1.144a10.5 10.5 0 0 0-4.589 4.59C12 12.978 12 15.918 12 21.8v36.4c0 5.88 0 8.82 1.144 11.067a10.5 10.5 0 0 0 4.59 4.589C19.978 75 22.918 75 28.8 75h13.45M75 75l-5.25-5.25m3.5-8.75c0 6.766-5.484 12.25-12.25 12.25S48.75 67.766 48.75 61 54.234 48.75 61 48.75 73.25 54.234 73.25 61Z"
    stroke="#000"
    stroke-width="5"
    stroke-linecap="round"
    stroke-linejoin="round"
  /></svg
>
<div class="font-semibold uppercase opacity-20 text-base-content">{$_("no_result")}</div>
