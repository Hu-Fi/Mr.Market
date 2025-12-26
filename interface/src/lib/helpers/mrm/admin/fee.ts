import { MRM_BACKEND_URL } from "$lib/helpers/constants";
import { getHeaders, handleApiResponse } from "$lib/helpers/mrm/common";

export const getGlobalFees = async (token: string) => {
  const response = await fetch(`${MRM_BACKEND_URL}/admin/fee/global`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleApiResponse(response);
}

export const updateGlobalFees = async (data: any, token: string) => {
  const response = await fetch(`${MRM_BACKEND_URL}/admin/fee/global`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleApiResponse(response);
}

export const getFeeOverrides = async (token: string) => {
  const response = await fetch(`${MRM_BACKEND_URL}/admin/fee/overrides`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleApiResponse(response);
}
