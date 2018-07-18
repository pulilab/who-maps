// import * as ProjectModule from './projects';
// import * as CountriesModule from './countries';

export const state = () => ({
  profiles: [],
  search_filters: [],
  languages: [],
  projectSearch: [],
  thematic_overview: [],
  axis: [],
  domains: [],
  landing_page_defaults: {},
  toolkit_questions: [],
  sub_level_types: [],
  organisations: []
});

export const getters = {
  getUserProfiles: state => {
    return state.profiles ? state.profiles.slice() : [];
  },

  getSearchResult: state => {
    const search = state.projectSearch ? state.projectSearch : [];
    return search.map(s => {
      // const country = CountriesModule.getCountry(state, s.country);
      return {
        ...s
        // ...ProjectModule.isMemberOrViewer(state, s),
        // country_name: country ? country.name : ''
      };
    });
  },

  getLanguages: state => {
    return state.languages.map(l => ({ ...l, flag: `/static/flags/${l.flag}` }));
  },

  getSearchFilters: state => {
    return [...state.search_filters];
  },

  getLandingPageDefaults: state => {
    return { ...state.landing_page_defaults };
  },

  getAxis: state => {
    return [...state.axis];
  },

  getDomains: state => {
    return [...state.domains];
  },

  getQuestions: state => {
    return [...state.toolkit_questions];
  },

  getThematicOverview: state => {
    const th = state.thematic_overview;
    return th.catergories
      ? th.categories.map(cat => ({ ...cat, domains: th.sub_categories.filter(sb => sb.category === cat.id) }))
      : [];
  },

  getDomainsForThematic: (state, getters) => {
    const axis = getters.getAxis;
    const domains = getters.getDomains;
    const thematic_specific = getters.getThematicOverview;
    return [
      ...thematic_specific.map(t => ({ name: t.name, domains: t.domains })),
      ...axis.map(a => ({
        name: a.name,
        domains: domains
          .filter(d => d.axis === a.id)
          .map(df => ({ name: df.name }))
      }))];
  },

  getSubLevelTypes: state => {
    return [...state.sub_level_types.map(t => ({ ...t }))];
  },

  getOrganisations: state => {
    return [...state.organisations.map(o => ({...o}))];
  }
};

export const actions = {

  async loadUserProfiles ({ commit }) {
    const { data } = await this.$axios.get('/api/userprofiles/');
    commit('SET_USER_PROFILES', data);
  },

  async loadStaticData ({ commit }) {
    const { data } = await this.$axios.get('/api/static-data/');
    commit('SET_AXIS', data.axis);
    commit('SET_DOMAINS', data.domains);
    commit('SET_LANDING_PAGE_DEFAULTS', data.landing_page_defaults);
    commit('SET_LANGUAGES', data.languages);
    // commit('SET_SEARCH_FILTERS', data.search_filters);
    commit('SET_THEMATIC_OVERVIEW', data.thematic_overview);
    commit('SET_TOOLKIT_QUESTIONS', data.toolkit_questions);
    commit('SET_SUB_LEVEL_TYPES', data.sub_level_types);
  },

  async loadOrganisations ({ commit, rootGetters }) {
    // const user = getState().user.profile;
    const profile = rootGetters['user/getProfile'];
    if (profile) {
      const { data } = await this.$axios.get(`/api/organisations/`);
      commit('SET_SYSTEM_ORGANISATIONS', data);
    }
  },

  async addOrganisation ({ commit, dispatch }, name) {
    const { data } = await this.$axios.post('/api/organisations/', { name });
    await dispatch('loadOrganisations');
    return Promise.resolve(data);
  }

  // searchProjects ({commit }, query, searchFilters) {
  //     const filters = {
  //       query
  //     };
  //     for (const f in searchFilters) {
  //       const item = searchFilters[f];
  //       filters[item.name] = item.value;
  //     }
  //     const { data } = await this.$axios.post('/api/search/projects/', filters);
  //     dispatch({ type: 'SET_PROJECT_SEARCH_RESULT', projects: data });
  // },

  // unsetSearchedProjects () {
  //   return dispatch => {
  //     dispatch({ type: 'UNSET_PROJECT_SEARCH_RESULT' });
  //   };
  // },
};

export const mutations = {
  SET_USER_PROFILES: (state, value) => {
    state.profiles = value;
  },

  SET_AXIS: (state, value) => {
    state.axis = value;
  },

  SET_DOMAINS: (state, value) => {
    state.domains = value;
  },

  SET_LANDING_PAGE_DEFAULTS: (state, value) => {
    state.landing_page_defaults = value;
  },

  SET_LANGUAGES: (state, value) => {
    state.languages = value;
  },

  SET_THEMATIC_OVERVIEW: (state, value) => {
    state.thematic_overview = value;
  },

  SET_TOOLKIT_QUESTIONS: (state, value) => {
    state.toolkit_questions = value;
  },

  SET_SUB_LEVEL_TYPES: (state, value) => {
    state.sub_level_types = value;
  },

  SET_SYSTEM_ORGANISATIONS: (state, value) => {
    state.organisations = value;
  }
};
