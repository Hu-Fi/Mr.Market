import { MRM_BACKEND_URL } from "$lib/helpers/constants";
import type { GrowInfo } from "$lib/types/hufi/grow";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getGrowBasicInfo = async (): Promise<GrowInfo> => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}/grow/info`)
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching grow basic info:', error);
  }
  return {} as GrowInfo;
}