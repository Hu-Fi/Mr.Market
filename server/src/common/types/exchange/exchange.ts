export interface SuccessResponse {
  type: 'success';
  exchange: string;
  id: string;
  api_key: string;
  secret: string;
}

export interface ErrorResponse {
  type: 'error';
  error: string;
}
