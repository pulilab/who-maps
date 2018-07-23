export const state = () => ({
  id: null,
  country: null,
  geoJson: null,
  countryCenter: null,
  firstSubLevel: '',
  firstSubLevelType: null,
  secondSubLevel: '',
  secondSubLevelType: null,
  facilities: [],
  subLevelsPolyCenters: []

});

export const getters = {
  getCountry (state) {
    return state.country;
  },
  getGeoJson (state) {
    return state.geoJson;
  },
  getCountryBorder (state, getters) {
    const geoJson = getters.getGeoJson;
    if (geoJson && geoJson.features && geoJson.features.length > 0) {
      return geoJson.features.find(
        f => f.properties['admin_level'] === '2'
      );
    }
  },
  getSubLevelFeatures (state, getters) {
    const geoJson = getters.getGeoJson;
    if (geoJson && geoJson.features && geoJson.features.length > 0) {
      return geoJson.features.filter(
        f => f.properties['admin_level'] !== '2'
      );
    }
  },
  getSubLevels (state, getters) {
    const features = getters.getSubLevelFeatures;
    const levels = [];
    if (features) {
      for (const f of features) {
        if (!levels.includes(f.properties.admin_level)) {
          levels.push(f.properties.admin_level);
        }
      }
    }
    return levels;
  },
  getSubLevelsPolyCenters (state) {
    return [ ...state.subLevelsPolyCenters.map(pc => ({name: pc.name, latlng: {...pc.latlng}})) ];
  },
  getFirstSubLevelMap (state, getters) {
    const features = getters.getSubLevelFeatures;
    if (features) {
      return features.filter(
        f => f.properties.admin_level === getters.getFirstSubLevel
      );
    }
    return [];
  },
  getFirstSubLevelList (state, getters) {
    const features = getters.getSubLevelFeatures;
    const firstSubLevel = getters.getFirstSubLevel;
    const firstSubLevelType = getters.getFirstSubLevelType;
    if (
      features &&
      firstSubLevel &&
      firstSubLevelType
    ) {
      return features
        .filter(f => f.properties.admin_level === firstSubLevel)
        .map(i => {
          const polyCenter = getters.getSubLevelsPolyCenters.find(pc => pc.name === i.properties.name);
          return { ...i.properties, polyCenter: polyCenter ? polyCenter.latlng : undefined };
        });
    }
    return [];
  },
  getSecondSubLevelList (state, getters) {
    const features = getters.getSubLevelFeatures;
    const secondSubLevel = getters.getSecondSubLevel;
    const secondSubLevelType = getters.getSecondSubLevelType;
    if (
      features &&
      secondSubLevel &&
      secondSubLevelType
    ) {
      return features
        .filter(f => f.properties.admin_level === secondSubLevel)
        .map(i => i.properties);
    }
    return [];
  },
  getCountryCenter (state) {
    return state.countryCenter;
  },
  getFirstSubLevel (state) {
    return state.firstSubLevel;
  },
  getFirstSubLevelType (state) {
    return state.firstSubLevelType;
  },
  getSecondSubLevel (state) {
    return state.secondSubLevel;
  },
  getSecondSubLevelType (state) {
    return state.secondSubLevelType;
  },
  getFacilities (state) {
    return [...state.facilities];
  }

};

const parseNames = (collection) => {
  const result = {};
  const nameKeys = Object.keys(collection).filter(k => k.includes('name:'));
  nameKeys.forEach(nk => (result[nk] = collection[nk]));
  return result;
};

export const actions = {
  async loadMapData ({commit, dispatch, rootGetters}) {
    const id = rootGetters['user/getProfile'].country;
    const { data } = await this.$axios.get(`/api/country-map-data/${id}/`);
    commit('SET_COUNTRY_ID', id);
    commit('SET_COUNTRY_DATA', data);
    try {
      dispatch('setCountryCenter', data.map_data.polylabel);
      dispatch('parseSubLevelsPolyCenters', data.map_data.first_sub_level);
      commit('SET_FACILITIES', data.map_data.facilities);
      commit('SET_FIRST_SUB_LEVEL', data.map_data.first_sub_level.admin_level);
      commit('SET_FIRST_SUB_LEVEL_TYPE', data.map_data.first_sub_level.name);
      commit('SET_SECOND_SUB_LEVEL', data.map_data.second_sub_level.admin_level);
      commit('SET_SECOND_SUB_LEVEL_TYPE', data.map_data.second_sub_level.name);
    } catch (e) {
      console.log('Saved data is corrupted or missing');
    }
    if (data.map_file) {
      await dispatch('loadGeoJSON');
    }
  },
  async loadGeoJSON ({commit, getters}) {
    const country = getters.getCountry;
    const { data } = await this.$axios.get(country.map_file);
    Object.freeze(data);
    commit('UPDATE_GEO_JSON', data);
  },
  setCountryCenter ({commit}, value) {
    value = value ? { ...value } : null;
    commit('SET_COUNTRY_CENTER', value);
  },
  setFirstSubLevel ({commit}, value) {
    commit('SET_FIRST_SUB_LEVEL', value);
  },
  setFirstSubLevelType ({commit}, value) {
    commit('SET_FIRST_SUB_LEVEL_TYPE', value);
  },
  setSecondSubLevel ({commit}, value) {
    commit('SET_SECOND_SUB_LEVEL', value);
  },
  setSecondSubLevelType ({commit}, value) {
    commit('SET_SECOND_SUB_LEVEL_TYPE', value);
  },
  parseSubLevelsPolyCenters ({dispatch}, value) {
    const polyCenters = value.elements.map(e => ({name: e.name, latlng: e.polyCenter}));
    dispatch('setSubLevelsPolyCenters', polyCenters);
  },
  setSubLevelsPolyCenters ({commit}, value) {
    commit('SET_SUB_LEVELS_POLYCENTERS', value);
  },
  updateSubLevelPolyCenter ({commit, getters}, {name, latlng}) {
    const current = getters.getSubLevelsPolyCenters;
    const index = current.findIndex(c => c.name === name);
    commit('UPDATE_SUB_LEVELS_POLYCENTERS', { index, data: { name, latlng } });
  },
  async saveMapData ({getters, rootGetters}) {
    const first = getters.getFirstSubLevelList.map(f => {
      return {
        name: f.name,
        polyCenter: f.polyCenter,
        ...parseNames(f.alltags)
      };
    });
    const second = getters.getSecondSubLevelList.map(s => {
      return {
        name: s.name,
        ...parseNames(s.alltags)
      };
    });
    const mapData = {
      polylabel: getters.getCountryCenter,
      first_sub_level: {
        admin_level: getters.getFirstSubLevel,
        name: getters.getFirstSubLevelType,
        elements: first
      },
      second_sub_level: {
        admin_level: getters.getSecondSubLevel,
        name: getters.getSecondSubLevelType,
        elements: second
      },
      facilities: getters.getFacilities
    };

    try {
      const id = rootGetters['user/getProfile'].country;
      await this.$axios.put(`/api/country-map-data/${id}/`, { map_data: mapData });
    } catch (e) {
      console.error(e);
    }
    this.saving = false;
  }
};
export const mutations = {
  SET_COUNTRY_ID: (state, id) => {
    state.id = id;
  },
  SET_COUNTRY_DATA: (state, {id, map_file}) => {
    state.country = {id, map_file};
  },
  SET_COUNTRY_CENTER: (state, data) => {
    state.countryCenter = data;
  },
  SET_FIRST_SUB_LEVEL: (state, data) => {
    state.firstSubLevel = data;
  },
  SET_FIRST_SUB_LEVEL_TYPE: (state, data) => {
    state.firstSubLevelType = data;
  },
  SET_SECOND_SUB_LEVEL: (state, data) => {
    state.secondSubLevel = data;
  },
  SET_SECOND_SUB_LEVEL_TYPE: (state, data) => {
    state.secondSubLevelType = data;
  },
  UPDATE_GEO_JSON: (state, data) => {
    state.geoJson = data;
  },
  SET_FACILITIES: (state, data) => {
    state.facilities = data;
  },
  SET_SUB_LEVELS_POLYCENTERS: (state, data) => {
    state.subLevelsPolyCenters = data;
  },
  UPDATE_SUB_LEVELS_POLYCENTERS: (state, {index, data}) => {
    state.subLevelsPolyCenters.splice(index, 1, data);
  }
};
