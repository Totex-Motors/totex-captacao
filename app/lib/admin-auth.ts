/**
 * Admin Authentication & Fetch Wrapper
 * Provides authenticated fetch for admin endpoints
 */

export async function adminFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const headers = new Headers(options?.headers ?? {});
  
  // Add auth token if available (implement as needed)
  // const token = localStorage.getItem('adminToken');
  // if (token) {
  //   headers.set('Authorization', `Bearer ${token}`);
  // }
  
  return fetch(url, {
    ...options,
    headers,
  });
}
