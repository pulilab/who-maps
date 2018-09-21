import qs from 'qs';

export const searchIn = () => ['name', 'org', 'country', 'overview', 'partner', 'donor', 'loc'];

export const stateGenerator = () => ({
  selectedCountry: null,
  currentZoom: 3,
  activeCountry: null,
  mapReady: false,
  projectBoxActiveTab: 'subNational',
  activeSubLevel: null,
  searchString: '',
  searchIn: searchIn(),
  projectsMap: []
});

export const gettersGenerator = () => ({
  getProjectsMap: state => [...state.projectsMap.map(r => ({...r}))],
  getCountryPins (state, getters, rootState, rootGetters) {
    const polyLabeled = rootGetters['countries/getCountries'].filter(c => c.map_data.polylabel);
    return polyLabeled.map(c => ({
      id: c.id,
      latlng: {...c.map_data.polylabel}
    }));
  },
  getSubLevelPins (state, getters, rootState, rootGetters) {
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
  getSelectedCountry: (state) => state.selectedCountry,
  getCurrentZoom: (state) => state.currentZoom,
  getActiveCountry: (state) => state.activeCountry,
  getCountryProjects: state => id => state.projectsMap.filter(p => p.country === id),
  getMapReady: state => state.mapReady,
  getProjectBoxActiveTab: state => state.projectBoxActiveTab,
  getActiveSubLevel: state => state.activeSubLevel,
  getSearchString: state => state.searchString,
  getSearchIn: state => state.searchIn,
  getLoading: state => state.loading,
  getSearchParameters: state => {
    const q = state.searchString && state.searchString.length > 1 ? state.searchString : undefined;
    return {
      page_size: 999999,
      q,
      found: true,
      in: q ? state.searchIn : undefined,
      type: 'map'
    };
  },
  getActiveTabProjects: (state, getters) => state.projectBoxActiveTab === 'subNational' ? getters.getSelectedCountrySubNationalProjects : getters.getSelectedCountryNationalProjects,
  getSelectedCountryProjects: state => state.projectsMap.filter(p => p.country === state.selectedCountry || p.country === state.activeCountry),
  getSelectedCountrySubNationalProjects: (state, getters) => getters.getSelectedCountryProjects.filter(cp => cp.coverage && cp.coverage.length > 0),
  getSelectedCountryNationalProjects: (state, getters) => getters.getSelectedCountryProjects.filter(cp => cp.national_level_deployment && Object.keys(cp.national_level_deployment).length > 0),
  getSelectedCountryCurrentSubLevelProjects: (state, getters, rootState, rootGetters) => {
    const id = state.activeSubLevel;
    const subLevel = rootGetters['countries/getSubLevelDetails'](id);
    return getters.getSelectedCountrySubNationalProjects.filter(snp => snp.coverage.some(c => c.district === id || c.district === subLevel.name));
  }
});

export const actionsGenerator = () => ({
  async setSelectedCountry ({commit, dispatch}, id) {
    await dispatch('countries/loadGeoJSON', id, {root: true});
    commit('SET_SELECTED_COUNTRY', id);
  },
  async loadProjects ({commit, getters, dispatch}, paramsOverride) {
    try {
      const { data } = await this.$axios({
        method: 'get',
        url: '/api/search/',
        params: {...getters.getSearchParameters, ...paramsOverride},
        paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
      });
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  setCurrentZoom ({commit}, value) {
    commit('SET_CURRENT_ZOOM', value);
    if (value < 6) {
      commit('SET_SELECTED_COUNTRY', null);
      commit('SET_ACTIVE_COUNTRY', null);
    }
  },
  setActiveCountry ({commit, getters, dispatch}, value) {
    if (value && getters.getSelectedCountry && getters.getSelectedCountry !== value) {
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
  },
  setSearchString ({commit}, value) {
    commit('SET_SEARCH_STRING', value);
  },
  setSearchIn ({commit}, value) {
    commit('SET_SEARCH_IN', value);
  }
});

export const mutationsGenerator = () => ({
  SET_PROJECT_MAP: (state, projects) => {
    state.projectsMap = projects;
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
  },
  SET_SEARCH_STRING: (state, value) => {
    state.searchString = value;
  },
  SET_SEARCH_IN: (state, value) => {
    state.searchIn = value;
  }
});
