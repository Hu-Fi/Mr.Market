import { HUFI_BACKEND_URL } from "$lib/helpers/constants";
import { getHeaders, handleApiResponse } from "../common";

export const fetchAllUsers = async (token: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/user/all`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    // console.log(await response.json())
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
