export default async function ({ store, redirect, app, route }) {
  const token = store.getters['user/getToken']
  if (!token) {
    const path = app.localePath({ name: 'organisation-login', params: route.params, query: { ...route.query, next: route.path } })
    redirect(path)
  }
}
