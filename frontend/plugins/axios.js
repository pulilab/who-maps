import { TokenCookieKey, getAccessToken, getRefreshToken } from '~/utilities/auth'

export default function ({ $axios, store, app, redirect }) {
  const ignoredPaths = ['/login', '/logout', '/api/jwt']

  $axios.onRequest(config => {
    const token = getAccessToken(app.$cookies.get(TokenCookieKey))
    const lng = app.i18n.locale
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    if (lng) {
      config.headers['Accept-Language'] = lng
    }
    return config
  })

  $axios.onError((error) => {
    return new Promise(async (resolve, reject) => {
      const isIgnored = ignoredPaths.some(path => error.config.url.includes(path))
      const statusCode = error.response ? error.response.status : -1

      if ((statusCode === 401 || statusCode === 422) && !isIgnored) {
        const { code } = error.response.data || {}
        const refreshToken = getRefreshToken(app.$cookies.get(TokenCookieKey))

        if (code === 'token_not_valid' && refreshToken) {
          if (error.config.hasOwnProperty('retryAttempts')) {
            await store.dispatch('user/logout')
            return redirect('/')
          } else {
            const config = { retryAttempts: 1, ...error.config }
            try {
              await store.dispatch('user/refreshToken')
              return resolve($axios(config))
            } catch (e) {
              await store.dispatch('user/logout')
              return redirect('/')
            }
          }
        } else if (code === 'token_not_valid') {
          await store.dispatch('user/logout')
          return redirect('/')
        }
      }
      return reject(error)
    })
  })
}
