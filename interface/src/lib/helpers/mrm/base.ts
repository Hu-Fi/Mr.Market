import { MRM_BACKEND_URL } from "../constants";

export const getBasicInfo = async () => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}`)
    return await response.json();
  } catch (error) {
    console.error('Error fetching basic info:', error);
  }
  return {};
}
