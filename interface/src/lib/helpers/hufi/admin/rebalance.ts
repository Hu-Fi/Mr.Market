import { HUFI_BACKEND_URL } from "$lib/helpers/constants";
import { getHeaders, handleApiResponse } from "$lib/helpers/hufi/common";
import { balances, balancesLoaded, balancesLoading } from "$lib/stores/admin";
import toast from "svelte-french-toast";

// Get all balances warpper
export const getAllBalancesWp = async (token: string, disableCache: string = 'false') => {
  try {
    balancesLoading.set(true);
    const resp = await getAllBalances(token, disableCache);
    console.log(resp)
    if (resp.code != 200) {
      throw Error(resp.message);
    }
    balances.set(resp.data);
    balancesLoaded.set(true);
  } catch (e) {
    toast.error(`Failed to get all exchange balance: ${e.message}`);
    balancesLoaded.set(false);
    return null;
  } finally {
    balancesLoading.set(false);
  }
}
export const getAllBalances = async (token: string, disableCache: string = 'false'): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/rebalance/all-balances?disableCache=${disableCache}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching all balances:', error);
    throw error;
  }
}

// Get balance by key label
export const getBalanceByKeyLabel = async (keyLabel: string, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/rebalance/balance/${keyLabel}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error fetching balance for key label ${keyLabel}:`, error);
    throw error;
  }
}

export async function getMixinDepositAddress(assetId: string, token: string) {
  if (!assetId) {
    throw new Error('asset_id is required');
  }

  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/exchange/deposit/mixin/create?asset_id=${encodeURIComponent(assetId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching deposit address:', error);
    throw error;
  }
}
