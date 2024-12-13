import { tokenExpired } from "$lib/helpers/hufi/admin";

export const getHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    tokenExpired();
    throw new Error('Unauthorized access - possibly invalid token');
  }
  if (response.status === 400) {
    const errorText = await response.json();
    throw new Error(`Bad request: ${errorText.message}`);
  }
  if (response.status === 500) {
    const errorText = await response.json();
    throw new Error(`Internal server error: ${errorText.message}`);
  }
  if (!response.ok) {
    const errorText = await response.json();
    throw new Error(`Network response was not ok: ${errorText.message}`);
  }
  return response.json();
};