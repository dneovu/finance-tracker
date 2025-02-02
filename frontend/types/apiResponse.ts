export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  code?: string;
}
