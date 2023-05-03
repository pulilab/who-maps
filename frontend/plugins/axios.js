export default function ({ $axios, app, store, redirect }) {

  /* $axios.onRequestError(error => {
    console.log('🚀 ~ file: axios.js:4 ~ onRequestError:', error)
  }) */

  $axios.onRequest(async config => {
    if (config) {
      const lng = app.i18n.locale
      if (lng) {
        config.headers['Accept-Language'] = lng
      }
      return config
    }
  })

  $axios.onResponse(response => {
    console.log(`[${response.status}] ${response.config.url}`)
  })

  $axios.onResponseError(async error => {
    const errorName = error?.name
    const responseCode = error.response ? error.response.status : undefined
    console.log('🚀 ~ file: axios.js:23 ~ errorName:', errorName)
    console.log('🚀 ~ file: axios.js:24 ~ responseCode:', responseCode)
    if (errorName === 'ExpiredAuthSessionError' || responseCode === 401) {
      await store.dispatch('user/logout')
      const path = app.localePath({ name: 'organisation-login' })
      redirect(path)
    }
    throw error
  })

  /* $axios.onError(async (error) => {
    const errorName = error?.name
    console.log('🚀 ~ file: axios.js:19 ~ $axios.onError ~ errorName:', errorName)
    // if (errorName === 'TypeError') return Promise.reject(error)
    if (errorName === 'ExpiredAuthSessionError' || errorName === 'TypeError') {
      await store.dispatch('user/logout')
      const path = app.localePath({ name: 'organisation-login' })
      redirect(path)
      return Promise.reject(error)
    }
  }) */
}
