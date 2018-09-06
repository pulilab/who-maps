import union from 'lodash/union';
import { saveToken, deleteToken } from '../utilities/auth';

export const state = () => ({
  token: null,
  user: null,
  profile: null
});

export const getters = {
  getToken: state => state.token,
  getUser: state => state.user,

  getProfile: state => {
    if (state.profile) {
      return { ...state.profile };
    }
    return null;
  }
};

export const actions = {

  async doLogin ({ commit, dispatch }, { username, password }) {
    const { data } = await this.$axios.post('/api/api-token-auth/', { username, password });
    commit('SET_USER', data);
    commit('SET_TOKEN', data.token);
    saveToken(data.token, data.user_profile_id);
    await dispatch('loadProfile', data.user_profile_id);
    await Promise.all([
      dispatch('system/loadOrganisations', {}, {root: true}),
      dispatch('projects/loadUserProjects', {}, {root: true}),
      dispatch('system/loadUserProfiles', {}, {root: true})
    ]);
  },

  async resetPassword (ctx, { email }) {
    const { data } = await this.$axios.post('/api/rest-auth/password/reset/', { email });
    return data;
  },

  async doSignup ({ commit, dispatch }, { account_type, password1, password2, email }) {
    const { data } = await this.$axios.post('/api/rest-auth/registration/',
      { account_type, password1, password2, email });
    data.token = data.key;
    commit('SET_USER', data);
    commit('SET_TOKEN', data.token);
    saveToken(data.token, data.user_profile_id);
    await dispatch('loadProfile', data.user_profile_id);
    await dispatch('system/loadOrganisations', {}, {root: true});
  },

  doLogout ({ commit }) {
    commit('SET_USER', null);
    commit('SET_PROFILE', null);
    commit('SET_TOKEN', null);
    deleteToken();
  },

  async loadProfile ({ commit, getters }, profileId) {
    if (getters.getToken && !getters.getProfile) {
      let { data } = await this.$axios.get(`/api/userprofiles/${profileId}/`);
      // console.log('userProfile');
      // console.log(data);
      commit('SET_PROFILE', data);
    }
  },

  async updateUserProfile ({ commit, dispatch }, profile) {
    if (isNaN(profile.organisation)) {
      const organisation = await dispatch('system/addOrganisation', profile.organisation, { root: true });
      profile.organisation = organisation.id;
    }
    const { data } = await this.$axios.put(`/api/userprofiles/${profile.id}/`, profile);
    data.email = data.email || data.user_email;
    commit('SET_PROFILE', data);
  },

  async setToken ({ commit, dispatch }, tokens) {
    commit('SET_TOKEN', tokens.jwt);
    await dispatch('loadProfile', tokens.profileId);
  },
  updateTeamViewers ({commit, getters}, {team, viewers, id}) {
    const user = getters.getProfile.id;
    const originalTeam = getters.getProfile.member;
    const originalViewer = getters.getProfile.viewer;
    const member = team.includes(user) ? union(originalTeam, [id]) : originalTeam;
    const viewer = viewers.includes(user) ? union(originalViewer, [id]) : originalViewer;
    commit('UPDATE_TEAM_VIEWER', {member, viewer});
  }

};

export const mutations = {

  SET_TOKEN: (state, token) => {
    state.token = token;
  },

  SET_USER: (state, user) => {
    state.user = user;
  },

  SET_PROFILE: (state, profile) => {
    state.profile = profile;
  },

  UPDATE_TEAM_VIEWER: (state, {member, viewer}) => {
    state.profile = {...state.profile, member, viewer};
  }
};
