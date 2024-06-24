import { HUFI_BACKEND_URL } from "$lib/helpers/constants";

export const getOauth = async (code: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/auth/oauth?code=${code}`);
    console.log('getOauth:', response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching OAuth data:', error);
  }
};
