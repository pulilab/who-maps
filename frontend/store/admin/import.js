export const state = () => ({
  queue: [],
  rawImport: null,
  countries: [],
  organisations: [],
  donors: [],
  collection: null
})

export const getters = {
  getQueue: state => state.queue,
  getRawImport: state => state.rawImport,
  getCollection: state => {
    return state.collection
      ? {
        name: state.collection.name,
        url: state.collection.url,
        projects: state.collection.projects.map(p => {
          return {
            id: p.id,
            status: p.published ? 'published' : 'draft',
            name: p.data.name,
            narrative: p.data.implementation_overview,
            country: state.countries.find(c => c.id === p.data.country),
            investors: p.data.donors.length > 0 ? state.donors.filter(d => p.data.donors.includes(d.id)) : [],
            organisation: state.organisations.find(o => o.id === parseInt(p.data.organisation)),
            team: p.team
          }
        })
      }
      : null
  }
}

export const actions = {
  async checkAvailability  ({ commit, state }, fileInfo) {
    const { data } = await this.$axios.post('api/projects/import-helpers/check-availability/', fileInfo)
    return data
  },
  async loadQueue ({ commit }) {
    const { data } = await this.$axios.get('/api/projects/import/')
    commit('setValue', { key: 'queue', val: data })
  },
  async addDataToQueue ({ commit }, imported) {
    const { data } = await this.$axios.post('api/projects/import/', imported)
    return data
  },
  async addCollection ({ commit }, collection) {
    const { data } = await this.$axios.post('api/projects/collections/', collection)
    return data
  },
  async updateCollection ({ commit }, collectionData) {
    const { data } = await this.$axios.patch(`api/projects/collections/${collectionData.url}/`, collectionData.importData)
    return data
  },
  async loadCollection ({ commit }, url) {
    const { data: organisations } = await this.$axios.get('/api/organisations/')
    const { data: countries } = await this.$axios.get('/api/landing-country/')
    const { data: donors } = await this.$axios.get('/api/landing-donor/')
    const { data } = await this.$axios.get(`/api/projects/collection/${url}/project-list/`)
    commit('setValue', { key: 'organisations', val: organisations })
    commit('setValue', { key: 'countries', val: countries })
    commit('setValue', { key: 'donors', val: donors })
    commit('setValue', { key: 'collection', val: data })
  },
  async loadImport ({ commit }, importId) {
    const { data } = await this.$axios.get(`/api/projects/import/${importId}/`)
    commit('setValue', { key: 'rawImport', val: data })
  },
  resetImport ({ commit }) {
    commit('setValue', { key: 'rawImport', val: null })
  },
  async deleteImportRow ({ commit }, rowId) {
    const { data } = await this.$axios.delete(`/api/projects/import-row/${rowId}/`)
    commit('setValue', { key: 'rawImport', val: data })
  },
  async addMeAsEditor ({ state, commit, rootState }, { collection_url, id }) {
    const { data } = await this.$axios.put(`/api/projects/import-helpers/add-me/${collection_url}/${id}/`)
    const user = {
      id: rootState.user.profile.id,
      name: rootState.user.profile.name,
      email: rootState.user.profile.email
    }
    const projectIdx = state.collection.projects.findIndex(p => p.id === id)
    commit('addTeamMember', { projectIdx, user: user })
    return data
  },
}

export const mutations = {
  setValue (state, { key, val }) {
    state[key] = val
  },
  addTeamMember(state, { projectIdx, user }) {
    state.collection.projects[projectIdx].team.push(user)
  }
}
