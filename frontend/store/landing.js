import { stateGenerator, gettersGenerator, actionsGenerator, mutationsGenerator } from '../utilities/map';

export const state = () => ({
  ...stateGenerator(),
  landingPageData: null,
  searched: null,
  cmsData: null,
  foundIn: {}
});

export const getters = {
  ...gettersGenerator(),
  getSearched: state => state.searched,
  getCMS: state => {
    if (!state.cmsData) {
      return null;
    }
    const regex = new RegExp(`.*${state.searchString}.*`, 'i');
    return state.cmsData.filter(function (row) {
      return regex.test(row.name) || regex.test(row.body) || regex.test(row.author);
    });
  },
  getLandingPageData: state => state.landingPageData,
  getSearchResult: (state, getters) => {
    if (state.searched && state.searched === state.searchString) {
      return getters.getProjectsMap;
    }
    return null;
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
  async search ({ commit, dispatch }) {
    try {
      commit('SET_SEARCHED', null);
      const { results } = await dispatch('loadProjects');
      commit('SET_PROJECT_MAP', results.projects);
      commit('SET_SEARCHED', results.search_term);
      commit('SET_FOUND_IN', results.found_in);
    } catch (e) {
    }
  },
  async cmsSearch ({ state, commit }) {
    try {
      // http://localhost:3000/api/cms/
      if (state.cmsData) {
        return;
      }
      commit('SET_CMS_DATA', null);
      const { data } = await this.$axios.get('/api/cms/', { q: state.searchString });
      commit('SET_CMS_DATA', data);
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
      commit('SET_LANDING_PAGE_DATA', Object.freeze(data));
    } catch (e) {
      console.error('landing/loadCountryData failed');
    }
  },
  async loadDonorData ({ commit, rootGetters }, code) {
    try {
      const donor = rootGetters['system/getDonors'].find(d => d.code.toLowerCase() === code.toLowerCase());
      const { data } = await this.$axios.get(`/api/landing-donor/${donor.id}/`);
      commit('SET_LANDING_PAGE_DATA', Object.freeze(data));
    } catch (e) {
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
  SET_FOUND_IN: (state, found) => {
    state.foundIn = { ...found };
  },
  SET_CMS_DATA: (state, data) => {
    state.cmsData = data;
  }
};
