import union from 'lodash/union'

export const state = () => ({
  tokens: null,
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

  async login ({ commit, dispatch }, { username, password }) {
    try {
      const { data: tokens } = await this.$axios.post('/api/token/', { username, password })
      commit('SET_TOKENS', tokens)
      await dispatch('loadProfile')
      await Promise.all([
        dispatch('system/loadOrganisations', {}, { root: true }),
        dispatch('projects/loadUserProjects', {}, { root: true }),
        dispatch('system/loadUserProfiles', {}, { root: true })
      ])
    } catch (error) {
      console.error('user/login failed')
    }
  },

  async resetPassword (ctx, { email }) {
    const { data } = await this.$axios.post('/api/rest-auth/password/reset/', { email })
    return data
  },

  async doSignup ({ commit, dispatch }, { account_type, password1, password2, email }) {
    const { data } = await this.$axios.post('/api/rest-auth/registration/',
      { account_type, password1, password2, email })
    // commit('SET_USER', data)
    commit('SET_TOKENS', data.token)
    // shouldn't be here at all
    // saveToken(data.token, data.user_profile_id)
    await dispatch('loadProfile', data.user_profile_id)
    await dispatch('system/loadOrganisations', {}, { root: true })
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
    commit('SET_TOKENS', null)
    commit('SET_PROFILE', null)
    commit('SET_APIKEY', null)
    dispatch('dashboard/resetUserInput', null, { root: true })
    dispatch('landing/resetUserInput', null, { root: true })
    dispatch('projects/resetProjectsData', null, { root: true })
  },

  async loadProfile ({ commit, getters, dispatch }, profileId = 'me') {
    try {
      if (getters.getToken && !getters.getProfile) {
        const { data } = await this.$axios.get(`/api/userprofiles/${profileId}/`)
        commit('SET_PROFILE', data)
        // dispatch('loadApiKey')
      }
    } catch (e) {
      console.error('user/loadProfile failed')
    }
  },

  async refreshProfile ({ commit, getters }) {
    try {
      if (getters.getToken && getters.getProfile && getters.getProfile.id) {
        const { data } = await this.$axios.get(`/api/userprofiles/${getters.getProfile.id}/`)
        commit('SET_PROFILE', data)
      }
    } catch (e) {
      console.error('user/loadProfile failed', e)
    }
  },

  async updateUserProfile ({ commit, dispatch }, profile) {
    if (isNaN(profile.organisation)) {
      const organisation = await dispatch('system/addOrganisation', profile.organisation, { root: true })
      profile.organisation = organisation.id
    }
    const { data } = await this.$axios.put(`/api/userprofiles/${profile.id}/`, profile)
    data.email = data.email || data.user_email
    commit('SET_PROFILE', data)
  },

  async refreshToken ({ commit, state, dispatch }) {
    try {
      if (state.tokens?.refresh) {
        const { data } = await this.$axios.post('/api/token/refresh', {
          refresh: state.tokens.refresh
        })
        console.log('🚀 ~ file: user.js:132 ~ refreshToken ~ data:', data)
      }
      commit('SET_TOKENS', {
        access: data.access,
        refresh: state.tokens.refresh
      })
    } catch (e) {
      console.error('user/refreshToken failed', e)
    }
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
  SET_TOKENS: (state, tokens) => {
    state.tokens = tokens
  },

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
