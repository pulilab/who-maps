export const state = () => ({
  queue: []
});
export const getters = {
  getQueue: state => state.queue
};
export const actions = {
  async loadQueue ({ commit }) {
    const { data } = await this.$axios.get('/api/projects/import/');
    // const filtered = data.filter(q => q.rows.some(r => !r.project));
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
  async updateQueueItem ({ commit, state }, item) {
    const { data } = await this.$axios.patch(`/api/projects/import/${item.id}/`, { ...item, id: null });
    const index = state.queue.findIndex(i => i.id === item.id);
    commit('UPDATE_QUEUE', { data, index });
  }
};

export const mutations = {
  SET_QUEUE: (state, queue) => {
    state.queue = queue;
  },
  UPDATE_QUEUE: (state, { data, index }) => {
    state.queue.splice(index, 1, data);
  }
};
