import { stateGenerator, gettersGenerator, actionsGenerator, mutationsGenerator } from '../utilities/map';

export const state = () => ({
  ...stateGenerator(),
  countryData: null,
  searched: null,
  foundIn: {}
});

export const getters = {
  ...gettersGenerator(),
  getCountryData: state => state.countryData,
  getSearchResult: (state, getters) => {
    if (state.searched && state.searched === state.searchString) {
      return getters.getProjectsMap;
    }
    return [];
  },
  getFoundIn: (state) => id => {
    const result = [];
    for (let category in state.foundIn) {
      if (state.foundIn[category].includes(id)) {
        result.push(category);
      }
    }
    return result;
  }
};

export const actions = {
  ...actionsGenerator(),
  async search ({commit, dispatch}) {
    commit('SET_SEARCHED', null);
    const { results } = await dispatch('loadProjects');
    commit('SET_PROJECT_MAP', results.projects);
    commit('SET_SEARCHED', results.search_term);
    commit('SET_FOUND_IN', results.found_in);
  },
  async loadCountryData ({commit, dispatch, rootGetters}, code) {
    const country = rootGetters['countries/getCountries'].find(c => c.code.toLowerCase() === code.toLowerCase());
    const { data } = await this.$axios.get(`/api/landing-country/${country.id}/`);
    await dispatch('setSelectedCountry', data.id);
    commit('SET_COUNTRY_LANDING_DATA', Object.freeze(data));
  },
  clearCountryData ({commit}) {
    commit('SET_COUNTRY_LANDING_DATA', null);
  }
};
export const mutations = {
  ...mutationsGenerator(),
  SET_COUNTRY_LANDING_DATA: (state, data) => {
    state.countryData = data;
  },
  SET_SEARCHED: (state, searched) => {
    state.searched = searched;
  },
  SET_FOUND_IN: (state, found) => {
    state.foundIn = {...found};
  }
};
