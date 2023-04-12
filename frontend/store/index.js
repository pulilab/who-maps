export const actions = {
  // https://nuxtjs.org/guide/vuex-store/#the-nuxtserverinit-action
  // automatically refresh the access token on the initial request to the server, if possible
  async nuxtServerInit({ dispatch, state }) {
    const { tokens } = state.user

    if (tokens?.access) {
      try {
        await dispatch('user/refreshToken')
        await dispatch('user/loadProfile')
      } catch (e) {
        await dispatch('user/logout')
      }
    }
  },
}