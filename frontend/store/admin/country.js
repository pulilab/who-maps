export const state = () => ({
  country: null,
  editableCountry: null
});

export const getters = {
  getCountry: state => state.editableCountry,
  getCoverText: state => state.editableCountry.cover_text
};

export const actions = {
  async fetchData ({ commit, rootGetters }) {
    const id = rootGetters['admin/map/getCountry'].id;
    const { data } = await this.$axios.get(`/api/country-admin/${id}/`);
    commit('SET_COUNTRY_DATA', data);
    commit('SET_EDITABLE_COUNTRY_DATA', data);
  },

  setCountryField ({ commit }, { field, data }) {
    commit('SET_COUNTRY_FIELD', {field, data});
  },

  setCoverText ({ commit }, txt) {
    commit('SET_COUNTRY_FIELD', {field: 'cover_text', data: txt});
  },

  setFooterTitle ({ commit }, txt) {
    commit('SET_COUNTRY_FIELD', {field: 'footer_title', data: txt});
  },

  setFooterText ({ commit }, txt) {
    commit('SET_COUNTRY_FIELD', {field: 'footer_text', data: txt});
  }
};

export const mutations = {
  SET_COUNTRY_DATA: (state, data) => {
    state.country = data;
  },

  SET_EDITABLE_COUNTRY_DATA: (state, data) => {
    state.editableCountry = data;
  },

  SET_COUNTRY_FIELD: (state, {field, data}) => {
    // console.log(`Filling ${field} with ${data}`);
    const valueToFill = typeof data === 'undefined' ? null : data;
    state.editableCountry[field] = valueToFill;
  }
};
