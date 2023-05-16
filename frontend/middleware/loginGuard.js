export default async function ({ app, $auth, redirect }) {
  const refreshTokenValid = $auth.strategy.refreshToken.status().valid()
  if (refreshTokenValid) {
    const routeParams = { name: 'organisation' }
    const path = app.localePath(routeParams)
    redirect(path)
  }
}

