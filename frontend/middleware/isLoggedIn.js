export default async function ({ redirect, app, route }) {
  if (!app.$auth.$state.loggedIn) {
    const path = app.localePath({ name: 'organisation-login', params: route.params, query: { ...route.query, next: route.path } })
    redirect(path)
  }
}
