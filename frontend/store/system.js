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
  countries: [],
  organisations: [],
  donors: [],
  regions: [],
  collections: [],
  donorsLibrary: {},
  policy_registry: {}
})

export const getters = {
  getUserProfiles: state => {
    return state.profiles ? [...state.profiles.filter(p => p.name)] : []
  },
  getUserProfilesNoFilter: state => {
    return state.profiles
  },
  getUserProfileDetails: (state, getters) => id =>
    getters.getUserProfiles.find(u => u.id === id),
  getSearchResult: state => {
    const search = state.projectSearch ? state.projectSearch : []
    return search.map(s => {
      return {
        ...s
      }
    })
  },
  getLanguages: state => {
    return state.languages
      .map(l => ({ ...l, flag: `/static/flags/${l.flag}` }))
      .filter(l => l.code !== 'ar')
  },

  getLanguageDetails: (state, getters) => code => {
    return getters.getLanguages.find(l => l.code === code)
  },
  getSearchFilters: state => {
    return [...state.search_filters]
  },
  getLandingPageDefaults: state => {
    return { ...state.landing_page_defaults }
  },
  getAxis: state => {
    return [...state.axis]
  },
  getDomains: state => {
    return [...state.domains]
  },
  getQuestions: state => {
    return [...state.toolkit_questions]
  },
  getThematicOverview: state => {
    const th = state.thematic_overview
    return th.categories
      ? th.categories.map(cat => ({
        ...cat,
        domains: th.sub_categories.filter(sb => sb.category === cat.id)
      }))
      : []
  },
  getDomainsForThematic: (state, getters) => {
    const axis = getters.getAxis
    const domains = getters.getDomains
    const thematic_specific = getters.getThematicOverview
    return [
      ...thematic_specific.map(t => ({ name: t.name, domains: t.domains })),
      ...axis.map(a => ({
        name: a.name,
        domains: domains
          .filter(d => d.axis === a.id)
          .map(df => ({ name: df.name }))
      }))
    ]
  },
  getSubLevelTypes: state => {
    return [...state.sub_level_types.map(t => ({ ...t }))]
  },
  getOrganisations: state => {
    return [...state.organisations.map(o => ({ ...o }))]
  },
  getOrganisationDetails: (state, getters) => id => {
    const o = getters.getOrganisations.find(org => org.id === id)
    return o ? { ...o } : undefined
  },
  getDonors: state => state.donors,
  getUserCollections: state => state.collections,
  getDonorDetails: state => id => ({
    ...state.donors.find(d => d.id === id),
    ...state.donorsLibrary[id]
  }),
  getRegions: state => state.regions,
  getRegionDetails: state => id => ({ ...state.regions.find(r => r.id === id) }),
  getPolicyRegistry: state => state.policy_registry,
}

export const actions = {
  async loadUserProfiles ({ commit, state }, force = false) {
    try {
      if (!state.profiles || state.profiles.length === 0 || force) {
        const { data } = await this.$axios.get('/api/userprofiles/')
        commit('setValue', { key: 'profiles', val: data })
      }
    } catch (e) {
      console.error('system/loadUserProfiles failed')
    }
  },

  async loadStaticData ({ state, commit, dispatch }) {
    // if the `languages` is filled then all static data should be filled
    if (state.languages.length > 0) return
    try {
      const { data } = await this.$axios.get('/api/static-data/')
      commit('setValue', { key: 'axis', val: data.axis })
      commit('setValue', { key: 'domains', val: data.domains })
      commit('setValue', { key: 'landing_page_defaults', val: data.landing_page_defaults })
      commit('setValue', { key: 'languages', val: data.languages })
      commit('setValue', { key: 'thematic_overview', val: data.thematic_overview })
      commit('setValue', { key: 'toolkit_questions', val: data.toolkit_questions })
      commit('setValue', { key: 'sub_level_types', val: data.sub_level_types })
      commit('setValue', { key: 'regions', val: data.regions })
      commit('setValue', { key: 'policy_registry', val: data.policy_registry })
      dispatch('dashboard/setDashboardColumns', data.dashboard_columns, {
        root: true
      })
      if (!state.countries) {
        dispatch('loadCountries')
      }
    } catch (e) {
      console.error('system/loadStaticData failed')
    }
  },
  async loadCountries ({ state, commit }) {
    try {
      if (state.countries.length === 0) {
        const { data } = await this.$axios.get('/api/landing-country/')
        commit('setValue', { key: 'countries', val: data })
      }
    } catch (e) {
      console.error('system/loadCountries failed')
    }
  },
  async loadOrganisations ({ state, commit }, force = false) {
    if (state.organisations.length === 0 || force) {
      try {
        const { data } = await this.$axios.get('/api/organisations/')
        commit('setValue', { key: 'organisations', val: data })
      } catch (e) {
        console.error('system/loadOrganisations failed')
      }
    }
  },
  async loadDonors ({ state, commit }) {
    if (state.donors.length > 0) return
    try {
      const { data } = await this.$axios.get('/api/landing-donor/')
      commit('setValue', { key: 'donors', val: data })
    } catch (e) {
      console.error('system/loadDonors failed')
    }
  },
  async loadUserCollections ({ commit }) {
    try {
      const { data } = await this.$axios.get('/api/projects/collection/my-collections/')
      commit('setValue', { key: 'collections', val: data })
    } catch (e) {
      console.error('system/loadUserCollections failed')
    }
  },
  async loadDonorDetails ({ commit, state }, id) {
    if (id && !state.donorsLibrary[id]) {
      try {
        const { data } = await this.$axios.get(`/api/landing-donor/${id}/`)
        commit('SET_DONOR_DETAILS', { id, data })
      } catch (e) {
        console.error('system/loadDonorDetails failed')
      }
    }
  },
  async addOrganisation ({ dispatch, getters }, name) {
    try {
      await this.$axios.post('/api/organisations/', { name })
    } catch (e) {
      console.error('system/addOrganisation failed')
    } finally {
      await dispatch('loadOrganisations', true)
    }
    const org = getters.getOrganisations.find(o => o.name === name)
    if (org) {
      return Promise.resolve(org)
    } else {
      const error = new Error(
        'Organisation saving / fetching failed, could not find the organisation'
      )
      return Promise.reject(error)
    }
  }
}

export const mutations = {
  setValue (state, { key, val }) {
    state[key] = val
  },
  SET_DONOR_DETAILS: (state, { id, data }) => {
    state.donorsLibrary = { ...state.donorsLibrary, [id]: data }
  }
}
