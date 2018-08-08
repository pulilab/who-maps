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
    const country = getters.getCountries.find(c => c.id === id);
    return {
      ...country,
      geoJson: getters.getCountryGeoJson(id),
      districts: getters.getCountryFirstSubLevel(id)
    };
  },
  getCountryGeoJson: (state, getters) => id => {
    return getters.getGeoJsonLibrary[id];
  },
  getCountryFirstSubLevel: (state, getters) => id => {
    const ln = 'en';
    const country = getters.getCountries.find(c => c.id === id);
    if (country && country.map_data && country.map_data.first_sub_level) {
      return country.map_data.first_sub_level.elements
        .map(ccd => ({ id: ccd.name, name: ccd[`name:${ln}`] || ccd['name:en'] || ccd.name }));
    }
    return [];
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
