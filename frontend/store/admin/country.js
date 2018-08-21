export const state = () => ({
  country: null,
  editableCountry: null,
  userSelection: [],
  adminSelection: [],
  superadminSelection: []
});

export const getters = {
  getStableCountry: state => state.country,
  getCountry: state => state.editableCountry,
  getCoverText: state => state.editableCountry && state.editableCountry.cover_text,
  getFooterTitle: state => state.editableCountry && state.editableCountry.footer_title,
  getFooterText: state => state.editableCountry && state.editableCountry.footer_text,
  getUserSelection: state => state.userSelection,
  getAdminSelection: state => state.adminSelection,
  getSuperadminSelection: state => state.superadminSelection,

  getUsers: state => state.country.users,
  getAdmins: state => state.country.admins,
  getSuperadmins: state => state.country.super_admins
};

export const actions = {
  async fetchData ({ commit, rootGetters, dispatch }) {
    const countryId = rootGetters['user/getProfile'].country;
    const { data } = await this.$axios.get(`/api/countries/${countryId}/`);
    // console.dir(data);
    commit('SET_COUNTRY_DATA', data);
    commit('SET_EDITABLE_COUNTRY_DATA', data);
    dispatch('mapAdminSelections', data);
  },

  mapAdminSelections ({ commit, rootGetters }, data) {
    const profiles = rootGetters['system/getUserProfiles'];
    const userId = rootGetters['user/getProfile'].id;

    const userIdMapping = id => {
      const profile = profiles.find(prof => prof.id === id);
      const label = `${profile.name} <${profile.user_email}>`;
      return {
        key: id,
        label,
        disabled: id === userId
      };
    };

    commit('SET_USER_SELECTION', [...data.user_requests, ...data.users].map(userIdMapping));
    commit('SET_ADMIN_SELECTION', [...data.admin_requests, ...data.admins].map(userIdMapping));
    commit('SET_SUPER_ADMIN_SELECTION', [...data.super_admin_requests, ...data.super_admins].map(userIdMapping));
  },

  async saveChanges ({ dispatch }) {
    await Promise.all([
      dispatch('patchInfoStrings'),
      dispatch('patchCountryImg', 'logo'),
      dispatch('patchCountryImg', 'cover'),
      dispatch('synchPartnerLogos'),
      dispatch('synchAdminUserArrays')
    ]);
    await dispatch('fetchData');
  },

  async patchInfoStrings ({ getters, rootGetters }) {
    const isThereChange = ['cover_text', 'footer_title', 'footer_text'].some(key => {
      return getters.getCountry[key] !== getters.getStableCountry[key];
    });

    if (isThereChange) {
      const countryId = rootGetters['user/getProfile'].country;

      const formData = new FormData();
      ['cover_text', 'footer_title', 'footer_text'].forEach(key => {
        if (getters.getCountry[key] !== getters.getStableCountry[key]) {
          formData.append(key, getters.getCountry[key]);
        }
      });

      const config = { headers: {
        'content-type': 'multipart/form-data'
      }};

      await this.$axios.patch(`/api/countries/${countryId}/`, formData, config);
    } else {
      // console.log('No change in country info strings');
      return Promise.resolve();
    }
  },

  async patchCountryImg ({ getters, rootGetters }, key) {
    const oldFilePath = getters.getStableCountry[key];

    const uploadNew = (oldFilePath === null) && getters.getCountry[key] && getters.getCountry[key].raw;
    const changeOld = !!oldFilePath && typeof getters.getCountry[key] !== 'string';

    if (uploadNew || changeOld) {
      const countryId = rootGetters['user/getProfile'].country;
      const formData = new FormData();
      formData.append(key, (getters.getCountry[key] || '') && getters.getCountry[key].raw);
      await this.$axios.patch(`/api/countries/${countryId}/`, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      });
    } else {
      return Promise.resolve();
    }
  },

  synchPartnerLogos ({ getters, dispatch }) {
    getters.getCountry.partner_logos.forEach(async logo => {
      if (logo.raw) {
        await dispatch('postPartnerLogo', logo.raw);
      }
    });

    getters.getStableCountry.partner_logos.forEach(async logo => {
      const isStillThere = !!getters.getCountry.partner_logos.find(newLogo => newLogo.id === logo.id);
      if (!isStillThere) {
        await dispatch('delPartnerLogo', logo.id);
      }
    });
  },

  async postPartnerLogo ({ rootGetters }, img) {
    const countryId = rootGetters['user/getProfile'].country;
    const formData = new FormData();
    formData.append('country', countryId);
    formData.append('image', img);
    await this.$axios.post(`/api/country-partner-logos/`, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    });
  },

  async delPartnerLogo (ctx, id) {
    await this.$axios.delete(`/api/country-partner-logos/${id}/`);
  },

  async synchAdminUserArrays ({ rootGetters, getters, state }, id) {
    const oldUsersStr = JSON.stringify([...state.country.users].sort());
    const newUsersStr = JSON.stringify([...state.editableCountry.users].sort());
    const oldAdminsStr = JSON.stringify([...state.country.admins].sort());
    const newAdminsStr = JSON.stringify([...state.editableCountry.admins].sort());
    const oldSuperAdminsStr = JSON.stringify([...state.country.super_admins].sort());
    const newSuperAdminsStr = JSON.stringify([...state.editableCountry.super_admins].sort());

    const diff = {};

    if (oldUsersStr !== newUsersStr) {
      diff.users = getters.getCountry.users || [];
    }
    if (oldAdminsStr !== newAdminsStr) {
      diff.admins = getters.getCountry.admins;
    }
    if (oldSuperAdminsStr !== newSuperAdminsStr) {
      diff.super_admins = getters.getCountry.super_admins;
    }

    if (diff.users || diff.admins || diff.super_admins) {
      const countryId = rootGetters['user/getProfile'].country;
      const formData = new FormData();
      console.log(diff);
      for (let key in diff) {
        diff[key].forEach(id => {
          // console.log(`appending ${key}[]: id`);
          formData.append(`${key}[]`, id);
        });
        if (!diff[key].length) {
          // console.log(`appending ${key}: null`);
          formData.append(`${key}[]`, undefined);
        }
        // Another approach
        // console.log(`appending ${key}: ${JSON.stringify(diff[key])} which is ${typeof diff[key]}`);
        // formData.append(key, diff[key]);
      }
      await this.$axios.patch(`/api/countries/${countryId}/`, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      });
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
    const valueToFill = typeof data === 'undefined' ? null : data;
    state.editableCountry[field] = valueToFill;
  },

  SET_USER_SELECTION: (state, data) => {
    state.userSelection = data;
  },

  SET_ADMIN_SELECTION: (state, data) => {
    state.adminSelection = data;
  },

  SET_SUPER_ADMIN_SELECTION: (state, data) => {
    state.superadminSelection = data;
  }

};
