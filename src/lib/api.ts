import { toLogin } from '@/utils/auth';
import ky from 'ky';

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Override the default JSON parser to check the `code` field.
  parseJson: (text: string) => {
    const json = JSON.parse(text);
    if (json.code !== "200") {
      throw new Error(json.message || 'API request error');
    }
    return json.data;
  },
  hooks: {
    beforeRequest: [
      (request) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        // Handle unauthorized responses
        if (response.status === 401) {
          toLogin();
        }
      }
    ]
  }
});

export default api;