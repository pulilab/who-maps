export const state = () => ({
  queue: []
});
export const getters = {
  getQueue: state => state.queue
};
export const actions = {
  async loadQueue ({ commit }) {
    const { data } = await this.$axios.get('/api/projects/import/');
    commit('SET_QUEUE', data);
  },
  async addDataToQueue ({ commit, state }, imported) {
    const { data } = await this.$axios.post(`api/projects/import/`, imported);
    const newQueue = [
      ...state.queue,
      data
    ];
    commit('SET_QUEUE', newQueue);
  },
  async updateQueueItem ({ commit }, item) {
    const { data } = await this.$axios.patch(`/api/projects/import/${item.id}/`, { ...item, id: null });
    console.log(data);
  }
};

export const mutations = {
  SET_QUEUE: (state, queue) => {
    state.queue = queue;
  }
};
