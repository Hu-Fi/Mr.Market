import { HUFI_BACKEND_URL } from "$lib/helpers/constants";
import { getHeaders, handleApiResponse } from "$lib/helpers/hufi/common";

export async function fetchAllStrategies(token: string) {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/strategy/all-strategies`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching strategies:', error);
    throw error;
  }
}
