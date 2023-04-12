export default function ({ $axios, store: { getters, dispatch }, redirect, app: { i18n } }) {
  const IGNORED_PATHS = ['/login', '/logout', 'api/token/refresh']

  $axios.onRequest(config => {
    const isIgnored = IGNORED_PATHS.some(path => config.url.includes(path))
    const token = getters['user/getToken']
    const lng = i18n.locale
    if (token && !isIgnored) {
      config.headers.Authorization = `Token ${token}`
    }
    if (lng) {
      config.headers['Accept-Language'] = lng
    }
    return config
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    console.log('🚀 ~ file: axios.js:18 ~ code:', code)
    if (code === 401) {
      dispatch('user/logout')
      redirect('/en/-/login/') // should be localepath?
    }
  })
}
