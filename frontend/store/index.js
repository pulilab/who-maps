export const actions = {
  async nuxtServerInit({ commit }) {
    if (this.$auth.loggedIn) {
      commit('user/SET_PROFILE', this.$auth.user)
    }
  },
}
