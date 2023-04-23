export default async function ({ redirect, app, route }) {
  if (!app.$auth.$state.loggedIn) {
    const routeParams = {
      name: 'organisation-login',
      params: route.params,
      query: { ...route.query, next: route.path }
    }
    const path = app.localePath(routeParams)
    redirect(path)
  }
}
