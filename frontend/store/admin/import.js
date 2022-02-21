export const state = () => ({
  queue: [],
  rawImport: null,
  countries: [],
  organizations: [],
  donors: [],
  collection: null
})

export const getters = {
  getQueue: state => state.queue,
  getRawImport: state => state.rawImport,
  getCollection: state => {
    const collection = {
      rawCollection: state.collection,
      name: state.collection.name,
      url: state.collection.url,
      projects: state.collection.projects.map(p => {
        return {
          id: p.id,
          status: p.published ? 'published' : 'draft',
          name: p.data.name,
          narrative: p.data.implementation_overview,
          country: state.countries.find(c => c.id === p.data.country),
          investor: p.data.donors.length > 0 ? state.donors.find(d => d.id === p.data.donors[0]) : '',
          organization: state.organizations.find(o => o.id === parseInt(p.data.organisation)),
          team: p.team
        }
      })
    }
    return collection
  }
}

export const actions = {
  async checkAvailability  ({ commit, state }, fileInfo) {
    const { data } = await this.$axios.post('api/projects/import-helpers/check-availability/', fileInfo)
    return data
  },
  async loadQueue ({ commit, state }) {
    const { data } = await this.$axios.get('/api/projects/import/')
    const refinedQueue = data.map((i) => {
      return {
        ...i,
        imported: i.rows.reduce((count, r) => {
          if (r.project) { count += 1 }
          return count
        }, 0)
      }
    })

    commit('setValue', { key: 'queue', val: refinedQueue })
  },
  async addDataToQueue ({ commit, state }, imported) {
    const { data } = await this.$axios.post('api/projects/import/', imported)
    // const newQueue = [
    //   ...state.queue,
    //   data
    // ]
    // commit('SET_QUEUE', newQueue)
    return data
  },
  async addCollection ({ commit, state }, collection) {
    const { data } = await this.$axios.post('api/projects/collections/', collection)
    return data
  },
  async updateCollection ({ commit, state }, collectionData) {
    const { data } = await this.$axios.patch(`api/projects/collections/${collectionData.url}/`, collectionData.importData)
    return data
  },
  async loadCollection ({ commit }, url) {
    const { data: organizations } = await this.$axios.get('/api/organisations/')
    const { data: countries } = await this.$axios.get('/api/landing-country/')
    const { data: donors } = await this.$axios.get('/api/landing-donor/')
    const { data } = await this.$axios.get(`/api/projects/collection/${url}/project-list/`)
    commit('setValue', { key: 'organizations', val: organizations })
    commit('setValue', { key: 'countries', val: countries })
    commit('setValue', { key: 'donors', val: donors })
    commit('setValue', { key: 'collection', val: data })
  },
  async loadImport ({ commit }, importId) {
    const { data } = await this.$axios.get(`/api/projects/import/${importId}/`)
    commit('setValue', { key: 'rawImport', val: data })
    return data
  },
  async deleteImportRow ({ commit }, rowId) {
    const { data } = await this.$axios.delete(`/api/projects/import-row/${rowId}/`)
    // const newRawImport
    // this.rawImport.rows.splice(index, 1)
    commit('setValue', { key: 'rawImport', val: data })
  },
  async addMeAsEditor ({ commit }, { collection_url, id }) {
    const { data } = await this.$axios.put(`/api/projects/import-helpers/add-me/${collection_url}/${id}/`)
    return data
  }
}

export const mutations = {
  setValue (state, { key, val }) {
    state[key] = val
  }
}
