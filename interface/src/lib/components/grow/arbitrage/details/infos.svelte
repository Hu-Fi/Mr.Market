<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { BN, formatDecimals, formatTimestampToTime } from "$lib/helpers/utils";

  export let tokenSymbol0 = "";
  export let tokenSymbol1 = "";
  export let amount0Start = 0;
  export let amount0Now = 0;
  export let amount1Start = 0;
  export let amount1Now = 0;
  export let apy = 0;
  export let profit = 0;
  export let createdAt = '';
</script>

<div class="flex flex-col p-6 space-y-6">
  <div class="flex flex-col space-y-4">
    <span class="opacity-60 text-sm">
      {$_("balance")}
    </span>

    <div class="flex flex-col space-y-2">
      {#each Array(2) as _, i}
        <div class="flex items-center justify-between">
          <span class="text-sm font-base">
            {i === 0 ? tokenSymbol0 : tokenSymbol1}
          </span>

          <div 
            class="tooltip" 
            data-tip={clsx(i === 0 
              ? `${formatDecimals(BN(amount0Now).dividedBy(BN(amount0Start)).toNumber(), 2)}%` 
              : `${formatDecimals(BN(amount1Now).dividedBy(BN(amount1Start)).toNumber(), 2)}%`)
            }
          >
            <span class="font-base text-sm">
              {
                i === 0 
                ? `${formatDecimals(amount0Start, 8)} -> ${formatDecimals(amount0Now, 8)}` 
                : `${formatDecimals(amount1Start, 8)} -> ${formatDecimals(amount1Now, 8)}`
              }
            </span>

            <span class="font-base text-[10px] opacity-60">
              { i === 0 ? 
                `(${formatDecimals(BN(amount0Now).dividedBy(BN(amount0Start)).toNumber(), 2)}%)` : 
                `(${formatDecimals(BN(amount1Now).dividedBy(BN(amount1Start)).toNumber(), 2)}%)` }
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="flex flex-col space-y-4">
    <span class="opacity-60 text-sm">
      {$_("details")}
    </span>
    <div class="flex flex-col space-y-4">
      <div class="flex justify-between">
        <span class="text-sm">
          {$_("apy")}
        </span>
        <span class="text-sm">
          {apy}%
        </span>
      </div>
    
      <div class="flex justify-between">
        <span class="text-sm">
          {$_("profit")}
        </span>
        <span class="text-sm">
          ${formatDecimals(profit, 2)}
        </span>
      </div>

      <div class="flex justify-between">
        <span class="text-sm">
          {$_("created_at")}
        </span>
        <span class="text-sm">
          {formatTimestampToTime(createdAt, true)}
        </span>
      </div>
    </div>
  </div>
</div>