import { stateGenerator, gettersGenerator, actionsGenerator, mutationsGenerator } from '../utilities/map';

export const state = () => ({
  ...stateGenerator(),
  projects: [],
  countryData: null
});

export const getters = {
  ...gettersGenerator(),
  getCountryData: state => state.countryData
};

export const actions = {
  ...actionsGenerator(),
  async loadPublicProjectList ({commit}) {
    const { data } = await this.$axios.get('/api/search/?page_size=10000');
    commit('SET_PROJECT_LIST', data.results.projects);
  },
  async loadCountryData ({commit, dispatch}, code) {
    const { data } = await this.$axios.get(`/api/landing/${code.toUpperCase()}/`);
    await dispatch('setSelectedCountry', data.id);
    commit('SET_COUNTRY_LANDING_DATA', Object.freeze(data));
  },
  clearCountryData ({commit}) {
    commit('SET_COUNTRY_LANDING_DATA', null);
  }
};
export const mutations = {
  ...mutationsGenerator(),
  SET_PROJECT_LIST: (state, list) => {
    state.projects = list;
  },
  SET_COUNTRY_LANDING_DATA: (state, data) => {
    state.countryData = data;
  }
};
