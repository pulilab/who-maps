export const state = () => ({
  country: null,
  editableCountry: null
});

export const getters = {
  getCountry: state => state.editableCountry
};

export const actions = {
  async fetchData ({ commit, rootGetters }) {
    console.log('FETCHING DATA!');
    const id = rootGetters['admin/map/getCountry'].id;
    const { data } = await this.$axios.get(`/api/country-admin/${id}/`);
    commit('SET_COUNTRY_DATA', data);
    commit('SET_EDITABLE_COUNTRY_DATA', data);
  }
};

export const mutations = {
  SET_COUNTRY_DATA: (state, data) => {
    console.log('setting data', data);
    state.country = data;
  },

  SET_EDITABLE_COUNTRY_DATA: (state, data) => {
    console.log('setting data 2', data);
    state.editableCountry = data;
  }
};
