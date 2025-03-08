import ky from 'ky';

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
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
    // afterResponse: [
    //   async (request, options, response) => {
    //     // Handle unauthorized responses
    //     if (response.status === 401) {
    //       if (typeof window !== 'undefined') {
    //         localStorage.removeItem('accessToken');
    //         window.location.href = '/auto/login';
    //       }
    //     }
    //   }
    // ]
  }
});

export default api;