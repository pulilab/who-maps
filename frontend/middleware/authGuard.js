export default async function ({ app, $auth, route, redirect }) {
  const executed = process.client ? 'client' : 'server'
  const refreshTokenValid = $auth.strategy.refreshToken.status().valid()
  console.info(`authGuard on [${executed}] [loggedIn: ${$auth.$state.loggedIn}] [refreshToken: ${refreshTokenValid}] [route: ${route.path}]`)
  if (!refreshTokenValid) {
    const routeParams = {
        name: 'organisation-login',
        params: route.params,
        query: { ...route.query, next: route.path }
      }
    const path = app.localePath(routeParams)
    redirect(path)
    return false
  }
}

