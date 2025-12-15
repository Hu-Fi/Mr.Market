<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ApiCampaign } from "$lib/helpers/mrm/campaignFormatter";
  import {
    formatAmount,
    formatDate,
    formatType,
    formatStatus,
    formatExchangeName,
    shortenAddress,
    getTargetLabel,
    getTargetValue,
    calculateAmountPaid,
    calculateOracleFees,
    getCampaignResults,
    getSymbolIcon,
  } from "$lib/helpers/mrm/campaignFormatter";

  export let campaign: ApiCampaign;

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    // You might want to add a toast notification here
  }

  // Get symbol icon
  const symbolIcon = getSymbolIcon(campaign.symbol);
</script>

<div class="flex flex-col space-y-6 pb-6">
  <!-- Campaign Header -->
  <div class="flex flex-col space-y-4 px-6 pt-6">
    <div class="flex items-center gap-3">
      <img
        src={symbolIcon}
        alt={campaign.symbol}
        class="w-12 h-12 rounded-full"
      />
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold">{campaign.symbol}</h1>
        <span class="text-sm text-base-content/70"
          >{formatExchangeName(campaign.exchange_name)}</span
        >
      </div>
    </div>

    <div class="flex items-center gap-2">
      <span class="badge badge-primary text-primary-content font-medium"
        >{formatType(campaign.type)}</span
      >
      <span class="badge badge-success text-success-content font-medium"
        >{formatStatus(campaign.status)}</span
      >
    </div>
  </div>

  <!-- Campaign Info Section -->
  <div class="flex flex-col space-y-4">
    <span class="font-bold text-sm bg-base-200 p-3 px-6">
      Campaign Information
    </span>
    <div class="flex flex-col space-y-4 px-6">
      <div class="flex justify-between items-center">
        <span class="text-sm font-bold">Contract Address</span>
        <div class="flex items-center gap-2">
          <span class="text-sm font-mono"
            >{shortenAddress(campaign.address)}</span
          >
          <button
            class="btn btn-ghost btn-xs"
            on:click={() => copyToClipboard(campaign.address)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex justify-between">
        <span class="text-sm font-bold">Duration</span>
        <span class="text-sm"
          >{formatDate(campaign.start_date)} - {formatDate(
            campaign.end_date,
          )}</span
        >
      </div>

      <div class="flex justify-between">
        <span class="text-sm font-bold">Exchange</span>
        <span class="text-sm">{formatExchangeName(campaign.exchange_name)}</span
        >
      </div>

      <div class="flex justify-between">
        <span class="text-sm font-bold">{getTargetLabel(campaign.type)}</span>
        <span class="text-sm font-bold text-primary"
          >{getTargetValue(campaign)}</span
        >
      </div>
    </div>
  </div>

  <!-- Funding Section -->
  <div class="flex flex-col space-y-4">
    <span class="font-bold text-sm bg-base-200 p-3 px-6"> Funding </span>
    <div class="flex flex-col space-y-4 px-6">
      <div class="flex justify-between">
        <span class="text-sm font-bold">Total Funded Amount</span>
        <span class="text-sm font-bold text-primary"
          >{formatAmount(
            campaign.fund_amount,
            campaign.fund_token_decimals,
            campaign.fund_token_symbol,
          )}</span
        >
      </div>

      <div class="flex justify-between">
        <span class="text-sm font-bold">Amount Paid</span>
        <span class="text-sm"
          >{calculateAmountPaid(
            campaign.fund_amount,
            campaign.balance,
            campaign.fund_token_decimals,
            campaign.fund_token_symbol,
          )}</span
        >
      </div>

      <div class="flex justify-between">
        <span class="text-sm font-bold">Reserved Funds</span>
        <span class="text-sm"
          >{formatAmount(
            campaign.reserved_funds,
            campaign.fund_token_decimals,
            campaign.fund_token_symbol,
          )}</span
        >
      </div>

      <div class="flex justify-between">
        <span class="text-sm font-bold">Oracle Fees</span>
        <span class="text-sm text-base-content/70"
          >{calculateOracleFees(
            campaign.fund_amount,
            campaign.fund_token_decimals,
            campaign.fund_token_symbol,
            campaign.exchange_oracle_fee_percent,
            campaign.recording_oracle_fee_percent,
            campaign.reputation_oracle_fee_percent,
          )}</span
        >
      </div>
    </div>
  </div>

  <!-- Results Section -->
  <div class="flex flex-col space-y-4">
    <span class="font-bold text-sm bg-base-200 p-3 px-6"> Results </span>
    <div class="flex flex-col space-y-4 px-6">
      <div class="flex justify-between items-center">
        <span class="text-sm font-bold">Campaign Results</span>
        <div class="flex items-center gap-2">
          <span
            class="w-2 h-2 rounded-full {getCampaignResults(campaign) === 'N/A'
              ? 'bg-error'
              : 'bg-warning'}"
          ></span>
          <span class="text-sm font-medium">{getCampaignResults(campaign)}</span
          >
          {#if getCampaignResults(campaign) !== "N/A"}
            <button class="btn btn-ghost btn-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .bg-base-200 {
    background-color: #f8fafc;
  }
</style>
