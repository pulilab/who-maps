export const state = () => ({
  queue: []
})
export const getters = {
  getQueue: state => state.queue
}
export const actions = {
  async loadQueue ({ commit, state }) {
    // if (!state.queue || state.queue.length === 0) {
    const { data } = await this.$axios.get('/api/projects/import/')
    commit('SET_QUEUE', data)
    // }
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
    // const newQueue = [
    //   ...state.queue,
    //   data
    // ]
    // commit('SET_QUEUE', newQueue)
    return data
  },
  async updateCollection ({ commit, state }, collectionData) {
    const { data } = await this.$axios.patch(`api/projects/collections/${collectionData.url}/`, collectionData.importData)
    // const newQueue = [
    //   ...state.queue,
    //   data
    // ]
    // commit('SET_QUEUE', newQueue)
    return data
  }
}

export const mutations = {
  SET_QUEUE: (state, queue) => {
    state.queue = queue
  }
}
