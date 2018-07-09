import { getTokensFromCookie, getTokensFromLocalStorage } from '../utilities/auth';

export default async function ({store, req}) {
  const tokens = process.server ? getTokensFromCookie(req) : getTokensFromLocalStorage();
  if (tokens && tokens.csrftoken) {
    await store.dispatch('user/setCsrfToken', tokens.csrftoken);
  }
}
