import { HUFI_BACKEND_URL } from "$lib/helpers/constants";
import { getHeaders, handleApiResponse } from "../common";

export const fetchSettings = async (token: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/settings/all`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
