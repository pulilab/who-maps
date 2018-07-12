export const state = () => ({
  countries: [],
  projects: []
});

export const getters = {

};
export const actions = {
  async loadMapData ({commit}) {
    const { data } = await this.$axios.get('/api/countries/');
    commit('SET_COUNTRY_LIST', data);
  },
  async loadPublicProjectList ({commit}) {
    const { data } = await this.$axios.get('/api/projects/map/');
    commit('SET_PROJECT_LIST', data);
  }
};
export const mutations = {
  SET_COUNTRY_LIST: (state, list) => {
    state.countries = list;
  },
  SET_PROJECT_LIST: (state, list) => {
    state.projects = list;
  }
};
