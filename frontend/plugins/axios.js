export default function ({ $axios, store: { getters } }) {
  $axios.interceptors.request.use(config => {
    const token = getters['user/getToken'];
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  });
}
