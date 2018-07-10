import { getTokenFromCookie, getTokenFromLocalStorage } from '../utilities/auth';

export default async function ({store, req}) {
  const token = process.server ? getTokenFromCookie(req) : getTokenFromLocalStorage();
  if (token) {
    await store.commit('user/SET_TOKEN', token);
  }
  return token;
}
