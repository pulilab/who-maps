export default async function({ $auth, app }) {
  console.log('🚀 ~ auth.js plugin:2 loggedIn:', $auth.$state.loggedIn)
  const cookieToken = await app.$cookies.get('auth._token.local')
  console.log('🚀 ~ file: auth.js:4 ~ function ~ cookieToken:', cookieToken)
}
