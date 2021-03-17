import { stateGenerator, gettersGenerator, actionsGenerator, mutationsGenerator } from '../utilities/map';

export const state = () => ({
  ...stateGenerator(),
  landingPageData: null,
  searched: null,
  cmsData: null,
  documentData: null,
  foundIn: {},
  loaded: false
});

export const getters = {
  ...gettersGenerator(),
  getSearched: state => state.searched,
  getLoaded: state => state.loaded,
  getCMS: state => {
    if (!state.cmsData) {
      return null;
    }
    const regex = new RegExp(`.*${state.searchString}.*`, 'i');
    return state.cmsData.filter(function (row) {
      return regex.test(row.name) || regex.test(row.body) || regex.test(row.author);
    });
  },
  getDocuments: state => {
    return state.documentData;
  },
  getLandingPageData: state => state.landingPageData,
  getIsCountry: state => state.landingPageData && state.landingPageData.isCountry,
  getSearchResult: (state, getters) => {
    if (state.searched && state.searched === state.searchString) {
      return getters.getProjectsMap;
    }
    return [];
  },
  getFoundIn: (state) => id => {
    const result = [];
    for (const category in state.foundIn) {
      if (state.foundIn[category].includes(id)) {
        result.push(category);
      }
    }
    return result;
  }
};

export const actions = {
  ...actionsGenerator(),
  async search ({ rootGetters, commit, dispatch }, code) {
    try {
      commit('SET_LOADED', false);
      commit('SET_SEARCHED', null);
      // TODO refactor for country / donor
      const params = (code && code.length > 2) ? { donor: rootGetters['system/getDonors'].find(d => d.code.toLowerCase() === code.toLowerCase()).id } : undefined;
      const { results } = await dispatch('loadProjects', params);
      commit('SET_PROJECT_MAP', results.projects);
      commit('SET_SEARCHED', results.search_term);
      commit('SET_FOUND_IN', results.found_in);
      commit('SET_LOADED', true);
    } catch (e) {
    }
  },
  async cmsSearch ({ state, commit }) {
    try {
      if (state.cmsData) {
        return;
      }
      commit('SET_CMS_DATA', null);
      const { data } = await this.$axios.get('/api/cms/', { params: { search: state.searchString } });
      commit('SET_CMS_DATA', data);
    } catch (e) {}
  },
  async documentSearch ({ state, commit }) {
    try {
      commit('SET_DOCUMENT_DATA', null);
      const { data } = await this.$axios.get('/api/document-search/', { params: { search: state.searchString } });
      commit('SET_DOCUMENT_DATA', data);
    } catch (e) {}
  },
  async loadCustomLandingPage ({ dispatch }, code) {
    if (code.length === 2) {
      await dispatch('loadCountryData', code);
    } else if (code.length > 2) {
      await dispatch('loadDonorData', code);
    }
  },
  async loadCountryData ({ commit, dispatch, rootGetters }, code) {
    try {
      const country = rootGetters['countries/getCountries'].find(c => c.code.toLowerCase() === code.toLowerCase());
      const { data } = await this.$axios.get(`/api/landing-country/${country.id}/`);
      await dispatch('setSelectedCountry', data.id);
      commit('SET_LANDING_PAGE_DATA', Object.freeze({ isCountry: true, ...data }));
    } catch (e) {
      console.error('landing/loadCountryData failed');
    }
  },
  async loadDonorData ({ commit, rootGetters }, code) {
    try {
      const donor = rootGetters['system/getDonors'].find(d => d.code.toLowerCase() === code.toLowerCase());
      const { data } = await this.$axios.get(`/api/landing-donor/${donor.id}/`);
      commit('SET_LANDING_PAGE_DATA', Object.freeze({ isCountry: false, ...data }));
    } catch (e) {
      console.error(e);
      console.error('landing/loadDonorData failed');
    }
  },
  clearCustomLandingPage ({ commit, dispatch }) {
    commit('SET_LANDING_PAGE_DATA', null);
    dispatch('setSelectedCountry');
  },
  resetSearch ({ commit }) {
    commit('SET_SEARCHED', null);
    commit('SET_SEARCH_STRING', null);
  }
};
export const mutations = {
  ...mutationsGenerator(),
  SET_LANDING_PAGE_DATA: (state, data) => {
    state.landingPageData = data;
  },
  SET_SEARCHED: (state, searched) => {
    state.searched = searched;
  },
  SET_LOADED: (state, loaded) => {
    state.loaded = loaded;
  },
  SET_FOUND_IN: (state, found) => {
    state.foundIn = { ...found };
  },
  SET_CMS_DATA: (state, data) => {
    state.cmsData = data;
  },
  SET_DOCUMENT_DATA: (state, data) => {
    state.documentData = data;
  }
};
