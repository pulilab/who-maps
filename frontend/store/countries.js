export const state = () => ({
  countries: [],
  geoJsonLibrary: {}
});
export const getters = {
  getCountries (state) {
    return [...state.countries.map(c => ({...c}))];
  },
  getGeoJsonLibrary (state) {
    return state.geoJsonLibrary;
  },
  getCountryDetails: (state, getters) => id => {
    return getters.getCountries.find(c => c.id === id);
  }
};

export const actions = {
  async loadMapData ({commit}) {
    const { data } = await this.$axios.get('/api/countries/');
    data.sort((a, b) => a.name.localeCompare(b.name));
    commit('SET_COUNTRY_LIST', data);
  },
  async loadGeoJSON ({commit, getters}, id) {
    if (!getters.getGeoJsonLibrary[id]) {
      const country = getters.getCountries.find(c => c.id === id);
      const { data } = await this.$axios.get(`/static/country-geodata/${country.code.toLowerCase()}.json?version=${country.map_version}`);
      Object.freeze(data);
      commit('UPDATE_JSON_LIBRARY', {id, data});
    }
  }
};

export const mutations = {
  SET_COUNTRY_LIST: (state, list) => {
    state.countries = list;
  },
  UPDATE_JSON_LIBRARY: (state, {id, data}) => {
    state.geoJsonLibrary[id] = data;
  }
};
