export default async function ({ $auth, redirect, route }) {
  const refreshTokenValid = $auth.strategy.refreshToken.status().valid()
  if (!refreshTokenValid || !$auth?.user?.is_superuser) {
    const paths = route.name.split('___')[1]
    const path = paths[1] || '/'
    redirect(path)
  }
}

