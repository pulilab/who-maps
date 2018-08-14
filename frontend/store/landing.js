export const state = () => ({
  projects: [],
  selectedCountry: null,
  currentZoom: 3,
  activeCountry: null,
  mapReady: false,
  projectBoxActiveTab: 'subNational',
  activeSubLevel: null
});

export const getters = {
  getLandingPagePins (state, getters, rootState, rootGetters) {
    const polyLabeled = rootGetters['countries/getCountries'].filter(c => c.map_data.polylabel && c.id !== state.selectedCountry);
    return polyLabeled.map(c => ({
      id: c.id,
      latlng: {...c.map_data.polylabel}
    }));
  },
  getDistrictPins (state, getters, rootState, rootGetters) {
    const selectedPolyLabeled = rootGetters['countries/getCountries'].filter(c => c.map_data.polylabel && c.id === state.selectedCountry);
    const pins = [];
    selectedPolyLabeled.forEach(sp => {
      if (sp.map_data && sp.map_data.first_sub_level && sp.map_data.first_sub_level.elements) {
        sp.map_data.first_sub_level.elements.forEach((e) => {
          if (e && e.polyCenter) {
            const id = e.id;
            pins.push({latlng: e.polyCenter, id});
          }
        });
      }
    });
    return pins;
  },
  getSelectedCountry (state) {
    return state.selectedCountry;
  },
  getCurrentZoom (state) {
    return state.currentZoom;
  },
  getActiveCountry (state) {
    return state.activeCountry;
  },
  getCountryProjects: state => id => {
    return state.projects.filter(p => p.country === id);
  },
  getMapReady: state => state.mapReady,
  getProjectBoxActiveTab: state => state.projectBoxActiveTab,
  getActiveSubLevel: state => state.activeSubLevel
};

export const actions = {
  async loadPublicProjectList ({commit}) {
    const { data } = await this.$axios.get('/api/projects/map/');
    commit('SET_PROJECT_LIST', data);
  },
  async setSelectedCountry ({commit, dispatch}, id) {
    await dispatch('countries/loadGeoJSON', id, {root: true});
    commit('SET_SELECTED_COUNTRY', id);
  },
  setCurrentZoom ({commit}, value) {
    commit('SET_CURRENT_ZOOM', value);
    if (value < 6) {
      commit('SET_SELECTED_COUNTRY', null);
      commit('SET_ACTIVE_COUNTRY', null);
    }
  },
  setActiveCountry ({commit, getters, dispatch}, value) {
    if (getters.getSelectedCountry && getters.getSelectedCountry !== value) {
      dispatch('setSelectedCountry', value);
    }
    commit('SET_ACTIVE_COUNTRY', value);
  },
  setMapReady ({commit}, value) {
    commit('SET_MAP_READY', value);
  },
  setProjectBoxActiveTab ({commit}, value) {
    commit('SET_PROJECT_BOX_ACTIVE_TAB', value);
  },
  setActiveSubLevel ({commit}, value) {
    commit('SET_ACTIVE_SUB_LEVEL', value);
  }
};
export const mutations = {
  SET_PROJECT_LIST: (state, list) => {
    state.projects = list;
  },
  SET_SELECTED_COUNTRY: (state, value) => {
    state.selectedCountry = value;
  },
  SET_CURRENT_ZOOM: (state, value) => {
    state.currentZoom = value;
  },
  SET_ACTIVE_COUNTRY: (state, value) => {
    state.activeCountry = value;
  },
  SET_MAP_READY: (state, value) => {
    state.mapReady = value;
  },
  SET_PROJECT_BOX_ACTIVE_TAB: (state, value) => {
    state.projectBoxActiveTab = value;
  },
  SET_ACTIVE_SUB_LEVEL: (state, value) => {
    state.activeSubLevel = value;
  }
};
