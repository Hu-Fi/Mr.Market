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
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Network response was not ok: ${errorText}`);
  }
  return response.json();
};