export default async function ({ redirect, $auth, app, route }) {
  // sometimes $auth is not ready on server side
  if (process.client && !$auth.$state.loggedIn) {
    const routeParams = {
      name: 'organisation-login',
      params: route.params,
      query: { ...route.query, next: route.path }
    }
    const path = app.localePath(routeParams)
    redirect(path)
  }
}
