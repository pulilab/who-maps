import auth from './auth.js'

export default async function ({ redirect, app, route, store }) {
  const authOkay = await auth({ app })
  if (authOkay) {
    store.dispatch('user/loadProfile')
  } else {
    const path = app.localePath({ name: 'organisation-login', params: route.params, query: { ...route.query, next: route.path } })
    redirect(path)
  }
}
