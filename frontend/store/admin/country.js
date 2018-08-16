export const state = () => ({
  country: null,
  editableCountry: null
});

export const getters = {
  getStableCountry: state => state.country,
  getCountry: state => state.editableCountry,
  getCoverText: state => state.editableCountry && state.editableCountry.cover_text,
  getFooterTitle: state => state.editableCountry && state.editableCountry.footer_title,
  getFooterText: state => state.editableCountry && state.editableCountry.footer_text
};

export const actions = {
  async fetchData ({ commit, rootGetters }) {
    const countryId = rootGetters['admin/map/getCountry'].id;
    const { data } = await this.$axios.get(`/api/country-admin/${countryId}/`);
    // console.log('DATAAAA:');
    // console.log(data);
    commit('SET_COUNTRY_DATA', data);
    commit('SET_EDITABLE_COUNTRY_DATA', data);
  },

  async saveChanges ({ dispatch }) {
    await dispatch('patchInfoStrings');
    await dispatch('patchCountryImg', 'logo');
    await dispatch('patchCountryImg', 'cover');
  },

  async patchInfoStrings ({ getters, rootGetters }) {
    const isThereChange = ['cover_text', 'footer_title', 'footer_text'].some(key => {
      return getters.getCountry[key] !== getters.getStableCountry[key];
    });

    if (isThereChange) {
      const countryId = rootGetters['admin/map/getCountry'].id;

      const formData = new FormData();
      ['cover_text', 'footer_title', 'footer_text'].forEach(key => {
        if (getters.getCountry[key] !== getters.getStableCountry[key]) {
          formData.append(key, getters.getCountry[key]);
        }
      });

      const config = { headers: {
        'content-type': 'multipart/form-data'
      }};

      await this.$axios.patch(`/api/country-admin/${countryId}/`, formData, config);
    } else {
      // console.log('No change in country info strings');
      return Promise.resolve();
    }
  },

  async patchCountryImg ({ getters, rootGetters }, key) {
    const oldFilePath = getters.getStableCountry[key];

    console.log('key', key);
    console.log('getters.getCountry[key]', getters.getCountry[key]);
    const uploadNew = (oldFilePath === null) && getters.getCountry[key] && getters.getCountry[key].raw;
    const changeOld = !!oldFilePath && typeof getters.getCountry[key] !== 'string';

    if (uploadNew || changeOld) {
      const countryId = rootGetters['admin/map/getCountry'].id;
      const formData = new FormData();
      formData.append(`${key}`, getters.getCountry[key] && getters.getCountry[key].raw);
      await this.$axios.patch(`/api/country-admin/${countryId}/`, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      });
    } else {
      console.log(`No change in country${key}`);
      return Promise.resolve();
    }
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
