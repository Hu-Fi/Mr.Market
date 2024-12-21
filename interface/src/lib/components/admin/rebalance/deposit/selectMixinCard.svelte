<script lang="ts">
  import { _ } from "svelte-i18n";
  import mixinIcon from '$lib/images/mixin.png';
    import { goto } from "$app/navigation";
</script>

<div class="tooltip tooltip-top" data-tip="ID: 0">
  <button class="stats shadow select-none min-w-60 h-full" on:click={() => {
    goto('/manage/rebalance/deposit/mixin');
  }}>
    <div class="stat text-left h-full">
      <div class="stat-figure text-green-500">
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
    </div>
  </button>
</div>