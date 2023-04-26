export default function ({ $axios, app, store, redirect }) {
  $axios.onRequest(config => {
    if (config) {
      const lng = app.i18n.locale
      if (lng) {
        config.headers['Accept-Language'] = lng
      }
      return config
    }
  })

  $axios.onError(async (error) => {
    if (error?.name === 'ExpiredAuthSessionError') {
      await store.dispatch('user/logout')
      const path = app.localePath({ name: 'organisation-login' })
      redirect(path)
    }
  })
}
