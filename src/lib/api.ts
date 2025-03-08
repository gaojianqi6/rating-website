import ky from 'ky';

const api = ky.create({
  prefixUrl: 'http://yourapi.com/api',
});

export default api;