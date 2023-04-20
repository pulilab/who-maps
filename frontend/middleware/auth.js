import { TokenCookieKey } from '~/utilities/auth'

export default function ({ app }) {
  const tokens = app.$cookies.get(TokenCookieKey)
  return tokens?.access && tokens?.refresh
}