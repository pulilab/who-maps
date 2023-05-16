export default async function ({ app, $auth, route, redirect }) {
  const refreshTokenValid = $auth.strategy.refreshToken.status().valid()
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

