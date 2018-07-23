import { saveToken, deleteToken } from '../utilities/auth';

export const state = () => ({
  token: null,
  user: null,
  profile: null
});

export const getters = {

  getToken: state => {
    return state.token;
  },

  getProfile: state => {
    if (state.profile) {
      return { ...state.profile };
    }
  },

  getUser: state => state.user
};

export const actions = {

  async doLogin ({ commit, dispatch }, { username, password }) {
    const { data } = await this.$axios.post('/api/api-token-auth/', { username, password });
    commit('SET_USER', data);
    commit('SET_TOKEN', data.token);
    saveToken(data.token, data.user_profile_id);
    await dispatch('loadProfile', data.user_profile_id);
    await dispatch('system/loadOrganisations', {}, {root: true});
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
      commit('SET_PROFILE', data);
    }
  },

  async updateUserProfile ({ getters, dispatch }, putObj) {
    const userId = getters.getProfile.id;
    await this.$axios.put(`/api/userprofiles/${userId}/`, putObj);
    await dispatch('loadProfile');
  },

  async setToken ({ commit, dispatch }, tokens) {
    commit('SET_TOKEN', tokens.jwt);
    await dispatch('loadProfile', tokens.profileId);
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
  }
};

/* eslint-disable no-warning-comments */
// import axios from '../../plugins/axios';
// import union from 'lodash/union';
// import Storage from '../../Storage';
// import * as ProjectModule from './projects';
// import * as SystemModule from './system';
// import * as CountryModule from './countries';
// import { setLanguage } from '../../plugins/language';

// const storage = new Storage();

// // GETTERS

// export const getUserLanguage = state => {
  //   const languages = SystemModule.getLanguages(state);
  //   const language = state && state && state.profile ? state.profile.language : undefined;
//   return languages.find(l => l.code === language);
// };

// export const isSuperUser = state => {
  //   return state.profile.is_superuser;
  // };

  // // ACTIONS
// storeData = (data, email) => {
//   storage.set('token', data.token);
//   storage.set('user_profile_id', data.user_profile_id);
//   storage.set('is_superuser', data.is_superuser);
//   storage.set('email', email);
//   storage.set('login', true);
//   axios.setAuthToken(data.token);
// }

// export const handleProfile = (data) => {
//   data.email = storage.get('email');
//   data.is_superuser = storage.get('is_superuser');
//   if (data.organisation) {
//     data.organisation_id = data.organisation;
//     data.organisation = {
//       name: data.organisation_name || '',
//       id: data.organisation_id
//     };
//   } else {
//     data.organisation = null;
//   }
//   return data;
// };

// export function saveProfile (profile) {
//   return async (dispatch, getState) => {
//     const state = getState();
//     const id = state.user_profile_id || storage.get('user_profile_id');
//     const url = id ? `/api/userprofiles/${id}/` : '/api/userprofiles/';
//     const action = id ? 'put' : 'post';
//     const p = Object.assign({}, profile);
//     p.organisation = p.organisation.id;
//     p.country = p.country.id;
//     let { data } = await axios[action](url, p);
//     data = exports.handleProfile(data);
//     setLanguage(data.language);
//     dispatch({ type: 'SET_PROFILE', profile: data });
//     dispatch(SystemModule.loadStaticData());
//     dispatch(ProjectModule.loadProjectStructure(true));
//   };
// }

// export function updateTeamViewers (team, viewer) {
//   return (dispatch, getState) => {
//     const originalTeam = getState().user.profile.member;
//     const originalViewer = getState().user.profile.viewer;
//     const newTeam = union(originalTeam, team);
//     const newViewer = union(originalViewer, viewer);
//     if (newTeam.length !== originalTeam.length || newViewer.length !== originalViewer.length) {
//       dispatch({ type: 'UPDATE_TEAM_VIEWER', member: newTeam, viewer: newViewer });
//     }
//   };
// }

// export async function verifyEmail (key) {
//   const { data } = await axios.post('/api/rest-auth/registration/verify-email/', key);
//   return data;
// }

// export async function resetPassword (emailObj) {
//   const { data } = await axios.post('/api/rest-auth/password/reset/', emailObj);
//   return data;
// }

// // Reducers

// export default function user (state = {}, action) {
//   switch (action.type) {
//   case 'SET_USER': {
//     return { ...state, ...action.user };
//   }
//   case 'SET_PROFILE': {
//     const profile = state.profile ? { ...state.profile, ...action.profile } : { ...action.profile };
//     return { ...state, profile };
//   }
//   case 'UPDATE_TEAM_VIEWER': {
//     const profile = state.profile || {};
//     profile.member = action.member;
//     profile.viewer = action.viewer;
//     return { ...state, profile };
//   }
//   case 'UNSET_USER': {
//     return {};
//   }
//   default:
//     return state;
//   }
// }
