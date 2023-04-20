export const TokenCookieKey = 'tokens'
export const TokenCookieExpiration = 60 * 60 * 24 * 365 // 1 year

export function getAccessToken(tokens) {
  return tokens?.access
}

export function getRefreshToken(tokens) {
  return tokens?.refresh
}