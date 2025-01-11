<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import mixinIcon from '$lib/images/mixin.png';

  export let path = '';
</script>

<div class="tooltip tooltip-top" data-tip="ID: 0">
  <button class="stats shadow select-none min-w-80 h-full" on:click={() => {
    goto(path);
  }}>
    <div class="stat text-left h-full">
      <div class="stat-figure">
        <div class="avatar">
          <div class="mask mask-squircle w-8 h-8">
            <img src={mixinIcon} alt="" />
          </div>
        </div>
      </div>
      <div class="stat-title">
        <span class="capitalize">mixin</span>
      </div>
      <div class="stat-value">
        <span class="capitalize">Mixin</span>
      </div>
      <div class="stat-desc mt-0.5 max-w-64 truncate" />
    </div>
  </button>
</div>