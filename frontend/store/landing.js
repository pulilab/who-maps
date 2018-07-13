export const state = () => ({
  countries: [],
  projects: [],
  geoJsonLibrary: {},
  selectedCountries: []
});

export const getters = {
  getCountries (state) {
    return [...state.countries.map(c => ({...c}))];
  },
  getLandingPagePins (state, getters) {
    const polyLabeled = getters.getCountries.filter(c => c.map_data.polylabel);
    return polyLabeled.map(c => ({
      id: c.id,
      latlng: {...c.map_data.polylabel}
    }));
  },
  getDistrictPins (state, getters) {
    const selectedPolyLabeled = getters.getCountries.filter(c => c.map_data.polylabel && state.selectedCountries.includes(c.id));
    const pins = [];
    selectedPolyLabeled.forEach(sp => {
      if (sp.map_data && sp.map_data.first_sub_level && sp.map_data.first_sub_level.elements) {
        sp.map_data.first_sub_level.elements.forEach((e, index) => {
          if (e && e.polyCenter) {
            const id = `${sp.id}-${index}`;
            pins.push({latlng: e.polyCenter, id});
          }
        });
      }
    });
    return pins;
  },
  getGeoJsonLibrary (state) {
    return state.geoJsonLibrary;
  },
  getSelectedCountries (state) {
    return state.selectedCountries;
  }
};

export const actions = {
  async loadMapData ({commit}) {
    const { data } = await this.$axios.get('/api/countries/');
    commit('SET_COUNTRY_LIST', data);
  },
  async loadPublicProjectList ({commit}) {
    const { data } = await this.$axios.get('/api/projects/map/');
    commit('SET_PROJECT_LIST', data);
  },
  async toggleCountry ({commit, dispatch, getters}, id) {
    const index = getters.getSelectedCountries.indexOf(id);
    if (index === -1) {
      await dispatch('loadGeoJSON', id);
      commit('ADD_SELECTED_COUNTRY', id);
    } else {
      commit('RM_SELECTED_COUNTRY', index);
    }
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
  SET_PROJECT_LIST: (state, list) => {
    state.projects = list;
  },
  ADD_SELECTED_COUNTRY: (state, c) => {
    state.selectedCountries.push(c);
  },
  UPDATE_JSON_LIBRARY: (state, {id, data}) => {
    state.geoJsonLibrary[id] = data;
  },
  RM_SELECTED_COUNTRY: (state, index) => {
    state.selectedCountries.splice(index, 1);
  }
};
