import { getTokenFromCookie, getTokenFromLocalStorage } from '../utilities/auth';

export default async function ({store, req}) {
  const tokens = process.server ? getTokenFromCookie(req) : getTokenFromLocalStorage();
  if (tokens && tokens.jwt && tokens.profileId) {
    await store.dispatch('user/setToken', tokens);
    return true;
  }
  return false;
}
