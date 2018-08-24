import { stateGenerator, gettersGenerator, actionsGenerator, mutationsGenerator } from '../utilities/map';

export const state = () => ({
  ...stateGenerator(),
  projects: []
});

export const getters = {
  ...gettersGenerator()
};

export const actions = {
  ...actionsGenerator(),
  async loadPublicProjectList ({commit}) {
    const { data } = await this.$axios.get('/api/projects/map/');
    commit('SET_PROJECT_LIST', data);
  }
};
export const mutations = {
  ...mutationsGenerator(),
  SET_PROJECT_LIST: (state, list) => {
    state.projects = list;
  }
};
