import union from 'lodash/union'

export const state = () => ({
  profile: null,
  apiKey: null,
  emailVerifyResult: null,
  cookieOn: false,
  feedbackOn: false,
  feedbackForm: {
    subject: '',
    message: ''
  }
})

export const getters = {
  getToken: state => state.tokens?.access,
  getUser: state => state.user,
  emailVerifiedRecently: state => state.emailVerifyResult,

  getProfile: state => {
    if (state.profile) {
      return { ...state.profile }
    }
    return null
  },
  getApiKey: state => state.apiKey
}

export const actions = {

  async login ({ dispatch }, loginPayload) {
    try {
      await this.$auth.loginWith('local', { data: loginPayload})
      await Promise.all([
        dispatch('loadApiKey'),
        dispatch('system/loadOrganisations', {}, { root: true }),
        dispatch('projects/loadUserProjects', {}, { root: true }),
        dispatch('system/loadUserProfiles', {}, { root: true })
      ])
      return 200
    } catch (error) {
      console.error('user/login failed')
      return error.response
    }
  },

  async resetPassword (ctx, { email }) {
    const { data } = await this.$axios.post('/api/rest-auth/password/reset/', { email })
    return data
  },

  async dorResetPassword ({ commit, dispatch }, { uid, token, new_password1, new_password2, errMessage = '' }) {
    try {
      await this.$axios.post('/api/rest-auth/password/reset/confirm/', { uid, token, new_password1, new_password2 })
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data
        if (!data.new_password1 && !data.new_password2) {
          data.non_field_errors = [errMessage]
        } else {
          [1, 2].forEach(function (index) {
            if (data['new_password' + index]) {
              data['password' + index] = data['new_password' + index]
              delete data['new_password' + index]
            }
          })
        }
        error.response.data = data
        throw error
      }
    }
  },

  logout ({ commit, dispatch }) {
    this.$auth.logout()
    commit('SET_APIKEY', null)
    dispatch('dashboard/resetUserInput', null, { root: true })
    dispatch('landing/resetUserInput', null, { root: true })
    dispatch('projects/resetProjectsData', null, { root: true })
  },

  async loadProfile ({ commit, dispatch }, apiKey = true) {
    try {
      const { data } = await this.$axios.get(`/api/userprofiles/me/`)
      commit('SET_PROFILE', data)
      if (apiKey) dispatch('loadApiKey')
    } catch (e) {
      console.error('user/loadProfile failed')
    }
  },

  async updateUserProfile ({ commit, dispatch }, profile) {
    if (isNaN(profile.organisation)) {
      const organisation = await dispatch('system/addOrganisation', profile.organisation, { root: true })
      profile.organisation = organisation.id
    }
    await this.$axios.put(`/api/userprofiles/${profile.id}/`, profile)
  },

  updateTeamViewers ({ commit, getters }, { team, viewers, id }) {
    const user = getters.getProfile.id
    const originalTeam = getters.getProfile.member
    const originalViewer = getters.getProfile.viewer
    const member = team.includes(user) ? union(originalTeam, [id]) : originalTeam.filter(o => o !== id)
    const viewer = viewers.includes(user) ? union(originalViewer, [id]) : originalViewer.filter(o => o !== id)
    commit('UPDATE_TEAM_VIEWER', { member, viewer })
    return team.includes(user) || viewers.includes(user)
  },

  async verifyEmail ({ commit }, key) {
    try {
      await this.$axios.post('/api/rest-auth/registration/verify-email/', { key })
      commit('EMAIL_VERIFY_RESULT', true)
    } catch (e) {
      commit('EMAIL_VERIFY_RESULT', false)
    }
  },

  async createApiKey ({ commit }) {
    try {
      const { data } = await this.$axios.post('/api/token/create/')
      commit('SET_APIKEY', data.key)
    } catch (e) {
      console.error('user/createApiKey failed')
    }
  },

  async loadApiKey ({ commit }) {
    try {
      const { data } = await this.$axios.get('/api/token/get/')
      commit('SET_APIKEY', data.key)
    } catch (e) {
      console.error('user/loadApiKey failed')
    }
  },

  async refreshApiKey ({ commit }) {
    try {
      const { data } = await this.$axios.post('/api/token/refresh/')
      commit('SET_APIKEY', data.key)
    } catch (e) {
      console.error('user/refreshApiKey failed')
    }
  },

  async deleteApiKey ({ commit }) {
    try {
      await this.$axios.delete('/api/token/delete/')
      commit('SET_APIKEY', null)
    } catch (e) {
      console.error('user/deleteApiKey failed')
    }
  }
}

export const mutations = {
  SET_COOKIE: (state, cookieOn) => {
    if (!process.server && cookieOn === false) {
      window.localStorage.setItem('cookie:accepted', 'true')
    }
    state.cookieOn = cookieOn
  },

  SET_PROFILE: (state, profile) => {
    state.profile = profile
  },

  SET_APIKEY: (state, apiKey) => {
    state.apiKey = apiKey
  },

  SET_FEEDBACK: (state, { feedbackOn, feedbackForm }) => {
    state.feedbackOn = feedbackOn
    if (feedbackForm) {
      state.feedbackForm = Object.assign({}, state.feedbackForm, feedbackForm)
    }
  },

  UPDATE_TEAM_VIEWER: (state, { member, viewer }) => {
    state.profile = { ...state.profile, member, viewer }
  },

  EMAIL_VERIFY_RESULT: (state, isSuccess) => {
    state.emailVerifyResult = isSuccess
  }
}
