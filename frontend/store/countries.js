export const state = () => ({
  countries: [],
  geoJsonLibrary: {},
  regions: [{id: 1, name: 'Afro'}, {id: 2, name: 'Europe'}]
});
export const getters = {
  getCountries (state) {
    return [...state.countries.map(c => ({...c}))];
  },
  getRegions: state => state.regions,
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
  getCountrySubLevelNames: (state, getters, rootState, rootGetters) => id => {
    const c = getters.getCountries.find(c => c.id === id);
    const types = rootGetters['system/getSubLevelTypes'];
    try {
      let first = types.find(t => t.name === c.map_data.first_sub_level.name);
      let second = types.find(t => t.name === c.map_data.second_sub_level.name);
      first = first ? first.displayName : c.map_data.first_sub_level.name;
      second = second ? second.displayName : c.map_data.second_sub_level.name;
      return {first, second};
    } catch (e) {
      return {};
    }
  },
  getCountryFirstSubLevel: (state, getters) => id => {
    const ln = 'en';
    const country = getters.getCountries.find(c => c.id === id);
    if (country && country.map_data && country.map_data.first_sub_level) {
      return country.map_data.first_sub_level.elements
        .map(ccd => ({ id: ccd.name, name: ccd[`name:${ln}`] || ccd['name:en'] || ccd.name }));
    }
    return [];
  },
  getCountrySecondSubLevel: (state, getters) => id => {
    const ln = 'en';
    const country = getters.getCountries.find(c => c.id === id);
    if (country && country.map_data && country.map_data.second_sub_level) {
      return country.map_data.second_sub_level.elements
        .map(ccd => ({ id: ccd.name, name: ccd[`name:${ln}`] || ccd['name:en'] || ccd.name }));
    }
    return [];
  },
  getCountryFacilityList: (state, getters) => id => {
    const country = getters.getCountries.find(c => c.id === id);
    if (country && country.map_data && country.map_data.facilities) {
      return country.map_data.facilities;
    }
    return [];
  },
  getSubLevelDetails: (state, getters) => id => {
    const allSubLevels = [];
    getters.getCountries.forEach(c => {
      if (c && c.map_data && c.map_data.first_sub_level) {
        allSubLevels.push(...c.map_data.first_sub_level.elements);
      }
    });
    return {...allSubLevels.find(sb => sb.id === id)};
  }
};

export const actions = {
  async loadMapData ({commit}) {
    const { data } = await this.$axios.get('/api/countries/');
    data.sort((a, b) => a.name.localeCompare(b.name));
    const frozen = data.map(cd => ({...cd, map_data: {...cd.map_data, facilities: Object.freeze(cd.map_data.facilities)}}));
    commit('SET_COUNTRY_LIST', frozen);
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
