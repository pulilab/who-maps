export default function ({ $axios, store: { state, getters } }) {
  $axios.interceptors.request.use(config => {
    const token = getters['user/getToken'];
    const lng = state.i18n.locale;
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    if (lng) {
      config.headers['Accept-Language'] = lng;
    }
    return config;
  });
}
