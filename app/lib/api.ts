/**
 * API Client Utilities
 * Provides typed API calls and helper functions
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// FIPE API Client
export const vehiclesApi = {
  fipe: {
    async brands() {
      const response = await fetch(`${API_URL}/api/fipe/brands`);
      if (!response.ok) throw new Error('Failed to fetch brands');
      return response.json();
    },
    async models(brandCode: string) {
      const response = await fetch(`${API_URL}/api/fipe/models/${brandCode}`);
      if (!response.ok) throw new Error('Failed to fetch models');
      return response.json();
    },
    async versions(brandCode: string, modelCode: string) {
      const response = await fetch(
        `${API_URL}/api/fipe/models/${modelCode}/years?brandId=${brandCode}`
      );
      if (!response.ok) throw new Error('Failed to fetch versions');
      return response.json();
    },
  },
};

/**
 * Resolve image URL - prepend API URL if relative path
 */
export function resolveUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;
}
