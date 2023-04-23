export default function ({ $axios, app }) {
  $axios.onRequest(config => {
    const lng = app.i18n.locale
    if (lng) {
      config.headers['Accept-Language'] = lng
    }
    return config
  })
}
