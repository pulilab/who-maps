export default function ({ $axios, app, redirect }) {

  $axios.onRequest(async config => {
    if (config) {
      const lng = app.i18n.locale
      if (lng) {
        config.headers['Accept-Language'] = lng
      }
      return config
    }
  })

  $axios.onResponseError(async error => {
    const errorName = error?.name
    // const responseCode = error.response ? error.response.status : undefined
    if (errorName === 'ExpiredAuthSessionError') {
      const path = app.localePath({ name: 'organisation-login' })
      redirect(path)
    } else {
      throw error
    }
  })
}
